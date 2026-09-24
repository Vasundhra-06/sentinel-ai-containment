from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ProtectedProfile(Base):
    __tablename__ = "protected_profiles"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    organization = Column(String)
    profession = Column(String, default="Research Scientist & Content Creator")
    handles = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    consent = relationship("Consent", back_populates="profile", uselist=False)
    incidents = relationship("Incident", back_populates="profile")
    representative_grants = relationship("RepresentativeGrant", back_populates="profile")
    recovery_credentials = relationship("RecoveryCredential", back_populates="profile")

class Consent(Base):
    __tablename__ = "consents"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("protected_profiles.id"))
    is_active = Column(Boolean, default=True)
    processing_mode = Column(String, default="CONSENTED_ANALYSIS") # "LOCAL_FINGERPRINT" or "CONSENTED_ANALYSIS"
    retention_days = Column(Integer, default=30)
    consent_given_at = Column(DateTime, default=datetime.utcnow)
    revoked_at = Column(DateTime, nullable=True)

    profile = relationship("ProtectedProfile", back_populates="consent")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True) # e.g. "HC-2041"
    title = Column(String, nullable=False)
    profile_id = Column(String, ForeignKey("protected_profiles.id"))
    category = Column(String, default="UNCONSENTED_MEDIA") # "UNCONSENTED_MEDIA", "IMPERSONATION", "DEFAMATION", "HARASSMENT"
    status = Column(String, default="ACTIVE MONITORING") # "ACTIVE MONITORING", "CONTAINED", "ARCHIVED"
    risk_score = Column(Integer, default=88)
    risk_level = Column(String, default="HIGH") # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("ProtectedProfile", back_populates="incidents")
    references = relationship("ReferenceAsset", back_populates="incident", cascade="all, delete-orphan")
    variants = relationship("Variant", back_populates="incident", cascade="all, delete-orphan")
    occurrences = relationship("Occurrence", back_populates="incident", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="incident", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="incident", cascade="all, delete-orphan")
    representative_grants = relationship("RepresentativeGrant", back_populates="incident")

class ReferenceAsset(Base):
    __tablename__ = "reference_assets"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    asset_type = Column(String, default="IMAGE") # "IMAGE", "VIDEO", "DOCUMENT"
    original_filename = Column(String)
    file_path = Column(String)
    sha256 = Column(String, nullable=False, index=True)
    phash = Column(String)
    dhash = Column(String)
    ahash = Column(String)
    width = Column(Integer)
    height = Column(Integer)
    provenance = Column(Text, default="Submitted by authorized case owner upon case intake")
    created_at = Column(DateTime, default=datetime.utcnow)

    incident = relationship("Incident", back_populates="references")
    variants = relationship("Variant", back_populates="root_reference")

class Variant(Base):
    """
    Represents a specific content representation / visual transformation of protected content.
    One variant can appear across multiple occurrences/sources.
    """
    __tablename__ = "variants"

    id = Column(String, primary_key=True, default=generate_uuid, index=True) # e.g. "VAR-2041-01"
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    root_reference_id = Column(String, ForeignKey("reference_assets.id"), nullable=True)
    variant_type = Column(String, default="ORIGINAL") # "ORIGINAL", "CROPPED", "WATERMARKED", "FILTERED", "REENCODED", "SCREENSHOT"
    label = Column(String)
    sha256 = Column(String, index=True)
    phash = Column(String, index=True)
    dhash = Column(String)
    ahash = Column(String)
    pdq_hash = Column(String, nullable=True)
    regional_hashes_json = Column(Text, nullable=True)
    embedding_vector_json = Column(Text, nullable=True)
    keypoints_json = Column(Text, nullable=True)
    status = Column(String, default="PENDING_REVIEW") # "PENDING_REVIEW", "VERIFIED_RELATED", "REJECTED", "REVOKED"
    enrolled_at = Column(DateTime, nullable=True)
    reviewer_id = Column(String, nullable=True)
    decision_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    incident = relationship("Incident", back_populates="variants")
    root_reference = relationship("ReferenceAsset", back_populates="variants")
    occurrences = relationship("Occurrence", back_populates="variant")
    registry_items = relationship("FingerprintRegistryItem", back_populates="variant")

class Occurrence(Base):
    """
    Represents a discrete discovery or upload event at a source platform.
    Has three independent states: processing, review, and partner outcome.
    """
    __tablename__ = "occurrences"

    id = Column(String, primary_key=True, index=True) # e.g. "HC-2041-001"
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    variant_id = Column(String, ForeignKey("variants.id"), nullable=True)
    
    platform = Column(String, nullable=False) # "Instagram", "X", "TikTok", "YouTube", "Reddit", "Web"
    variant_type = Column(String, default="Original")
    url = Column(String, nullable=False)
    account_handle = Column(String)
    idempotency_key = Column(String, unique=True, nullable=True, index=True)
    
    # 3 Independent States
    processing_state = Column(String, default="SUCCEEDED") # "QUEUED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELLED"
    review_state = Column(String, default="VERIFIED_RELATED") # "RELATED_CANDIDATE", "REVIEW_REQUIRED", "VERIFIED_RELATED", "UNRELATED", "REJECTED"
    partner_outcome_state = Column(String, default="NOT_SUBMITTED") # "NOT_SUBMITTED", "AWAITING_ACK", "PENDING_REVIEW", "BLOCKED", "REMOVED", "RESTRICTED", "NO_ACTION", "FAILED", "REVOKED"
    
    similarity_score = Column(Float, default=94.0)
    risk_level = Column(String, default="HIGH")
    status = Column(String, default="Active") # Backwards compatibility field
    
    sha256 = Column(String)
    phash = Column(String)
    dhash = Column(String, nullable=True)
    ahash = Column(String, nullable=True)
    ocr_text = Column(Text, nullable=True)
    signals_json = Column(Text, nullable=True) # Full inspectable match signals dictionary
    
    detected_at = Column(DateTime, default=datetime.utcnow)
    source_timestamp = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)

    incident = relationship("Incident", back_populates="occurrences")
    variant = relationship("Variant", back_populates="occurrences")
    review_decisions = relationship("ReviewDecision", back_populates="occurrence")

class FingerprintRegistryItem(Base):
    """
    Authenticated registry of approved, active fingerprints exported to partner networks.
    """
    __tablename__ = "fingerprint_registry"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    opaque_id = Column(String, unique=True, index=True) # e.g. "REG-FP-4a9f201e"
    variant_id = Column(String, ForeignKey("variants.id"), nullable=False)
    incident_id = Column(String, nullable=False)
    algorithm = Column(String, nullable=False) # "SHA256", "PHASH", "DHASH", "PDQ", "SIFT_DESCRIPTORS", "SSCD_EMBEDDING"
    version = Column(String, default="1.0")
    format = Column(String, default="HEX") # "HEX", "BASE64", "JSON"
    fingerprint_value = Column(Text, nullable=False)
    status = Column(String, default="ACTIVE") # "ACTIVE", "REVOKED", "EXPIRED"
    authorization_scope = Column(String, default="GLOBAL_CONTAINMENT")
    revision = Column(Integer, default=1)
    enrolled_by = Column(String, default="system_admin")
    created_at = Column(DateTime, default=datetime.utcnow)
    revoked_at = Column(DateTime, nullable=True)

    variant = relationship("Variant", back_populates="registry_items")

class PartnerSubscription(Base):
    __tablename__ = "partner_subscriptions"

    id = Column(String, primary_key=True, default=generate_uuid)
    partner_id = Column(String, unique=True, index=True) # e.g. "partner_meta_demo", "partner_x_demo"
    name = Column(String, nullable=False)
    endpoint_url = Column(String)
    webhook_secret = Column(String, nullable=False)
    subscribed_algorithms = Column(Text, default="SHA256,PHASH,DHASH")
    is_active = Column(Boolean, default=True)
    last_sync_cursor = Column(String, nullable=True)
    last_synced_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PartnerSyncEvent(Base):
    __tablename__ = "partner_sync_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    event_id = Column(String, unique=True, index=True)
    partner_id = Column(String, ForeignKey("partner_subscriptions.partner_id"), nullable=False)
    cursor = Column(String, index=True)
    event_type = Column(String, nullable=False) # "ENROL", "REVOKE", "UPDATE"
    payload_json = Column(Text, nullable=False)
    acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(String, primary_key=True, default=generate_uuid)
    occurrence_id = Column(String, ForeignKey("occurrences.id"), nullable=True)
    variant_id = Column(String, nullable=True)
    reviewer = Column(String, nullable=False)
    action = Column(String, nullable=False) # "APPROVE_VARIANT", "REJECT", "DETACH", "ROLLBACK", "REVOKE"
    previous_state = Column(String)
    new_state = Column(String)
    reason = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    occurrence = relationship("Occurrence", back_populates="review_decisions")

class RepresentativeGrant(Base):
    __tablename__ = "representative_grants"

    id = Column(String, primary_key=True, default=generate_uuid)
    profile_id = Column(String, ForeignKey("protected_profiles.id"), nullable=False)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=True)
    representative_email = Column(String, nullable=False)
    representative_name = Column(String)
    scopes = Column(String, default="SUBMIT,VIEW_MEDIA,REVIEW") # comma-separated
    token_hash = Column(String, nullable=False, index=True)
    status = Column(String, default="ACTIVE") # "ACTIVE", "EXPIRED", "REVOKED"
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime, nullable=True)

    profile = relationship("ProtectedProfile", back_populates="representative_grants")
    incident = relationship("Incident", back_populates="representative_grants")

class RecoveryCredential(Base):
    __tablename__ = "recovery_credentials"

    id = Column(String, primary_key=True, default=generate_uuid)
    profile_id = Column(String, ForeignKey("protected_profiles.id"), nullable=False)
    code_hash = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    used = Column(Boolean, default=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("ProtectedProfile", back_populates="recovery_credentials")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    job_type = Column(String, nullable=False) # "MEDIA_ANALYSIS", "VIDEO_DECODE", "REGISTRY_SYNC", "PARTNER_CALLBACK"
    status = Column(String, default="QUEUED") # "QUEUED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELLED"
    progress = Column(Integer, default=0)
    payload_json = Column(Text, nullable=True)
    result_json = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    incident_id = Column(String, nullable=True)
    details = Column(Text)
