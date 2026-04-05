from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
import time

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


# In-memory mock store (replaced by DB in production)
_mock_contacts: dict[str, list] = {}
_mock_sos_log: list = []


@router.post("/trigger")
async def trigger_sos(payload: SOSRequest):
    """Trigger SOS alert — sends mock SMS and logs the event."""
    start = time.time()
    maps_link = f"https://maps.google.com/?q={payload.lat},{payload.lng}"
    message = f"JEEWAN EMERGENCY ALERT: Help needed at {maps_link}"

    # Mock SMS — just log, no real API call
    contacts = payload.emergency_contacts or ["+91XXXXXXXXXX"]
    for contact in contacts:
        _mock_sos_log.append({
            "to": contact,
            "message": message,
            "timestamp": time.time(),
        })

    elapsed = time.time() - start
    return {
        "status": "sent",
        "latency_ms": round(elapsed * 1000),
        "contacts_notified": len(contacts),
        "maps_link": maps_link,
        "mock": True,
    }


@router.get("/contacts")
async def get_contacts(user_id: str = "demo-user"):
    """Get saved emergency contacts for a user."""
    return {"contacts": _mock_contacts.get(user_id, [])}


@router.post("/contacts")
async def save_contacts(user_id: str, contacts: List[SOSContact]):
    """Save/update emergency contacts."""
    _mock_contacts[user_id] = [c.model_dump() for c in contacts]
    return {"status": "saved", "count": len(contacts)}
