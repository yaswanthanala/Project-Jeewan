"""Auth MS Routes — Registration, Login, Guest Token, Profile."""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
import os

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET", "jeewan-super-secret-key-change-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))  # 24h

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

# In-memory user store (PostgreSQL in production)
# Passwords are hashed lazily at startup to avoid bcrypt import-time issues
_users: dict[str, dict] = {}
_otp_store: dict[str, str] = {}  # email/phone -> OTP

# Demo account definitions (plaintext passwords, hashed at startup)
_DEMO_ACCOUNTS = [
    {"id": "demo-user-001", "email": "demo@jeewan.org", "phone": "+919999999999", "name": "Arjun Demo", "role": "user", "password": "demo1234", "institution": "NIT AP"},
    {"id": "counsellor-001", "email": "counsellor@jeewan.org", "phone": "+919888888888", "name": "Dr. Priya Sharma", "role": "counsellor", "password": "demo1234", "institution": ""},
    {"id": "admin-001", "email": "admin@jeewan.org", "phone": "+919777777777", "name": "Admin User", "role": "admin", "password": "admin1234", "institution": ""},
    {"id": "volunteer-001", "email": "volunteer@jeewan.org", "phone": "+919666666666", "name": "Volunteer Lead", "role": "volunteer", "password": "demo1234", "institution": "NIT AP"},
    {"id": "institution-001", "email": "college@jeewan.org", "phone": "+919555555555", "name": "NIT AP Coordinator", "role": "institution", "password": "demo1234", "institution": "NIT AP"},
]


def _init_demo_users():
    """Initialize demo users with hashed passwords (called at startup)."""
    for acct in _DEMO_ACCOUNTS:
        _users[acct["email"]] = {
            "id": acct["id"],
            "email": acct["email"],
            "phone": acct["phone"],
            "name": acct["name"],
            "role": acct["role"],
            "password_hash": pwd_context.hash(acct["password"]),
            "institution": acct["institution"],
        }


# ── Schemas ──
class RegisterRequest(BaseModel):
    email: EmailStr
    phone: str = ""
    name: str
    password: str
    role: str = "user"
    institution: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class OTPSendRequest(BaseModel):
    identifier: str  # email or phone


class OTPVerifyRequest(BaseModel):
    identifier: str
    otp: str


# ── Helpers ──
def create_token(user: dict) -> str:
    payload = {
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"],
        "name": user["name"],
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# ── Routes ──
@router.post("/register")
async def register(req: RegisterRequest):
    """Register a new user with email + password."""
    if req.email in _users:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = f"user-{len(_users) + 1:04d}"
    user = {
        "id": user_id,
        "email": req.email,
        "phone": req.phone,
        "name": req.name,
        "role": req.role if req.role in ["user", "volunteer", "institution"] else "user",
        "password_hash": pwd_context.hash(req.password),
        "institution": req.institution,
    }
    _users[req.email] = user

    return {
        "access_token": create_token(user),
        "token_type": "bearer",
        "user": {"id": user_id, "email": req.email, "name": req.name, "role": user["role"]},
    }


@router.post("/login")
async def login(req: LoginRequest):
    """Login with email + password, returns JWT."""
    user = _users.get(req.email)
    if not user or not pwd_context.verify(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": create_token(user),
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]},
    }


@router.post("/guest-token")
async def guest_token():
    """Issue an anonymous guest JWT — no login required (FR-01)."""
    guest = {
        "id": f"guest-{datetime.now(timezone.utc).timestamp():.0f}",
        "email": "anonymous@jeewan.org",
        "role": "guest",
        "name": "Anonymous User",
    }
    return {
        "access_token": create_token(guest),
        "token_type": "bearer",
        "user": guest,
    }


@router.get("/me")
async def get_profile(credentials=Depends(__import__('fastapi.security', fromlist=['HTTPBearer']).HTTPBearer())):
    """Get current user profile from JWT."""
    from app.middleware.rbac import decode_jwt
    payload = decode_jwt(credentials.credentials)
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "role": payload.get("role"),
    }


@router.post("/otp/send")
async def send_otp(req: OTPSendRequest):
    """Send OTP to email or phone (mock — always returns 123456)."""
    _otp_store[req.identifier] = "123456"
    return {"status": "sent", "message": f"OTP sent to {req.identifier}", "mock": True}


@router.post("/otp/verify")
async def verify_otp(req: OTPVerifyRequest):
    """Verify OTP and return JWT if valid."""
    stored = _otp_store.get(req.identifier)
    if not stored or stored != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Find or create user
    user = None
    for u in _users.values():
        if u["email"] == req.identifier or u["phone"] == req.identifier:
            user = u
            break

    if not user:
        user = {
            "id": f"user-otp-{len(_users) + 1:04d}",
            "email": req.identifier if "@" in req.identifier else "",
            "phone": req.identifier if "@" not in req.identifier else "",
            "name": "New User",
            "role": "user",
            "password_hash": "",
            "institution": "",
        }
        _users[req.identifier] = user

    del _otp_store[req.identifier]
    return {
        "access_token": create_token(user),
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user.get("email", ""), "name": user["name"], "role": user["role"]},
    }


@router.get("/demo-accounts")
async def list_demo_accounts():
    """List all demo accounts for testing."""
    return {
        "accounts": [
            {"email": "demo@jeewan.org", "password": "demo1234", "role": "user"},
            {"email": "counsellor@jeewan.org", "password": "demo1234", "role": "counsellor"},
            {"email": "volunteer@jeewan.org", "password": "demo1234", "role": "volunteer"},
            {"email": "college@jeewan.org", "password": "demo1234", "role": "institution"},
            {"email": "admin@jeewan.org", "password": "admin1234", "role": "admin"},
        ]
    }
