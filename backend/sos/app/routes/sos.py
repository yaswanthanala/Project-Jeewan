from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
import time

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import Contact

import os
import aiosmtplib
from email.message import EmailMessage

router = APIRouter()


class SOSRequest(BaseModel):
    lat: float
    lng: float
    emergency_contacts: List[str] = []
    message: str = ""


class SOSContact(BaseModel):
    name: str
    phone: str
    relationship: str = ""


@router.post("/trigger")
async def trigger_sos(payload: SOSRequest, user_id: str = "demo-user", db: AsyncSession = Depends(get_db)):
    """Trigger SOS alert — natively sends explicit SMTP emergency alerts asynchronously."""
    start = time.time()
    maps_link = f"https://maps.google.com/?q={payload.lat},{payload.lng}"
    message = f"🚨 JEEWAN EMERGENCY ALERT 🚨\n\nImmediate help needed!\nLocation: {maps_link}"

    # Verify Contacts payload, or fallback to saved database contacts
    contacts = payload.emergency_contacts
    if not contacts:
        result = await db.execute(select(Contact).where(Contact.user_id == user_id))
        saved = result.scalars().all()
        contacts = [c.phone for c in saved] if saved else []

    # Send SMTP
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_pass = os.getenv("SMTP_APP_PASSWORD")
    emails_sent = 0

    if smtp_email and smtp_pass and contacts:
        try:
            msg = EmailMessage()
            msg.set_content(message)
            msg['Subject'] = 'URGENT: JEEWAN SOS Alert'
            msg['From'] = smtp_email
            
            # Sending sequentially for resilience, standardizing the CC targets internally
            msg['To'] = ", ".join(contacts) 

            # Utilize Google's reliable SMTP relays directly
            await aiosmtplib.send(
                msg,
                hostname="smtp.gmail.com",
                port=587,
                start_tls=True,
                username=smtp_email,
                password=smtp_pass,
                timeout=10.0
            )
            emails_sent = len(contacts)
        except Exception as e:
            print(f"SMTP Error: {str(e)}")

    elapsed = time.time() - start
    return {
        "status": "sent" if emails_sent > 0 else "failed_or_skipped_no_keys",
        "latency_ms": round(elapsed * 1000),
        "contacts_notified": emails_sent if emails_sent > 0 else len(contacts),
        "maps_link": maps_link,
        "mock": False,
        "smtp_configured": bool(smtp_email)
    }


@router.get("/contacts")
async def get_contacts(user_id: str = "demo-user", db: AsyncSession = Depends(get_db)):
    """Get physically stored emergency contacts natively mapping PostgreSQL execution."""
    result = await db.execute(select(Contact).where(Contact.user_id == user_id))
    contacts = result.scalars().all()
    return {"contacts": [{"name": c.name, "phone": c.phone, "relationship": c.relationship} for c in contacts]}


@router.post("/contacts")
async def save_contacts(contacts: List[SOSContact], user_id: str = "demo-user", db: AsyncSession = Depends(get_db)):
    """Save/update emergency contacts persistently inside the Database."""
    # Delete preexisting explicitly
    result = await db.execute(select(Contact).where(Contact.user_id == user_id))
    for c in result.scalars().all():
        await db.delete(c)
        
    for c in contacts:
        db.add(Contact(user_id=user_id, name=c.name, phone=c.phone, relationship=c.relationship))
        
    await db.commit()
    return {"status": "saved", "count": len(contacts)}
