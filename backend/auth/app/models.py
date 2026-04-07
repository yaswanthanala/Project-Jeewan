from sqlalchemy import Column, String, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")
    password_hash = Column(String, nullable=False)
    institution = Column(String, nullable=True)


class OTPStore(Base):
    __tablename__ = "otp_store"

    identifier = Column(String, primary_key=True, index=True)
    otp = Column(String, nullable=False)
