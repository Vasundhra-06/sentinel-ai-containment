from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class ProtectedProfile(Base):
    __tablename__ = "protected_profiles"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    organization = Column(String)
    handles = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    consent = relationship("Consent", back_populates="profile", uselist=False)
    incidents = relationship("Incident", back_populates="profile")

class Consent(Base):
    __tablename__ = "consents"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("protected_profiles.id"))
    is_active = Column(Boolean, default=True)
    consent_given_at = Column(DateTime, default=datetime.utcnow)
    revoked_at = Column(DateTime, nullable=True)

    profile = relationship("ProtectedProfile", back_populates="consent")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    profile_id = Column(String, ForeignKey("protected_profiles.id"))
    status = Column(String, default="ACTIVE MONITORING")
    risk_score = Column(Integer, default=88)
    risk_level = Column(String, default="HIGH")
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("ProtectedProfile", back_populates="incidents")
    occurrences = relationship("Occurrence", back_populates="incident")
    evidence = relationship("Evidence", back_populates="incident")
    reports = relationship("Report", back_populates="incident")

class Occurrence(Base):
    __tablename__ = "occurrences"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"))
    platform = Column(String, nullable=False)
    variant_type = Column(String, nullable=False)
    url = Column(String, nullable=False)
    account_handle = Column(String)
    detected_at = Column(DateTime, default=datetime.utcnow)
    similarity_score = Column(Float, default=94.0)
    risk_level = Column(String, default="HIGH")
    status = Column(String, default="Active")
    sha256 = Column(String)
    phash = Column(String)
    ocr_text = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="occurrences")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"))
    occurrence_id = Column(String)
    platform = Column(String)
    url = Column(String)
    account = Column(String)
    captured_at = Column(DateTime, default=datetime.utcnow)
    sha256 = Column(String, nullable=False)
    phash = Column(String)
    integrity_status = Column(String, default="VERIFIED")

    incident = relationship("Incident", back_populates="evidence")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"))
    occurrence_id = Column(String)
    platform = Column(String, nullable=False)
    target_url = Column(String, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    policy_category = Column(String)
    status = Column(String, default="Submitted")
    response_details = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="reports")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text)
