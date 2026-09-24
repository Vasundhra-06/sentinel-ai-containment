from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReferenceAssetSchema(BaseModel):
    id: str
    incident_id: str
    asset_type: str = "IMAGE"
    original_filename: Optional[str] = None
    sha256: str
    phash: Optional[str] = None
    dhash: Optional[str] = None
    ahash: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    provenance: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class VariantSchema(BaseModel):
    id: str
    incident_id: str
    root_reference_id: Optional[str] = None
    variant_type: str
    label: Optional[str] = None
    sha256: Optional[str] = None
    phash: Optional[str] = None
    dhash: Optional[str] = None
    ahash: Optional[str] = None
    pdq_hash: Optional[str] = None
    status: str # "PENDING_REVIEW", "VERIFIED_RELATED", "REJECTED", "REVOKED"
    enrolled_at: Optional[datetime] = None
    reviewer_id: Optional[str] = None
    decision_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class OccurrenceSchema(BaseModel):
    id: str
    incident_id: str
    variant_id: Optional[str] = None
    platform: str
    variant_type: str
    url: str
    account_handle: Optional[str] = None
    idempotency_key: Optional[str] = None
    
    # 3 Independent States
    processing_state: str = "SUCCEEDED"
    review_state: str = "VERIFIED_RELATED"
    partner_outcome_state: str = "NOT_SUBMITTED"
    
    similarity_score: float
    risk_level: str
    status: str
    sha256: Optional[str] = None
    phash: Optional[str] = None
    dhash: Optional[str] = None
    ahash: Optional[str] = None
    ocr_text: Optional[str] = None
    signals_json: Optional[str] = None
    
    detected_at: datetime
    source_timestamp: Optional[datetime] = None
    verified_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class IncidentSchema(BaseModel):
    id: str
    title: str
    profile_id: str
    category: str = "UNCONSENTED_MEDIA"
    status: str
    risk_score: int
    risk_level: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class IncidentDetailSchema(IncidentSchema):
    protected_profile_name: Optional[str] = "Dr. Evelyn Carter"
    references_count: int = 1
    variants_count: int = 2
    occurrences_count: int = 2
    containment_rate: int = 100
    references: List[ReferenceAssetSchema] = []
    variants: List[VariantSchema] = []
    occurrences: List[OccurrenceSchema] = []

class FingerprintRegistryItemSchema(BaseModel):
    id: str
    opaque_id: str
    variant_id: str
    incident_id: str
    algorithm: str
    version: str
    format: str
    fingerprint_value: str
    status: str
    authorization_scope: str
    revision: int
    created_at: datetime
    revoked_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PartnerSubscriptionSchema(BaseModel):
    id: str
    partner_id: str
    name: str
    endpoint_url: Optional[str] = None
    subscribed_algorithms: str
    is_active: bool
    last_sync_cursor: Optional[str] = None
    last_synced_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewDecisionRequest(BaseModel):
    action: str = Field(..., description="APPROVE_VARIANT, REJECT, DETACH, ROLLBACK, REVOKE")
    reviewer: str = Field(..., description="Reviewer identifier or name")
    reason: str = Field(..., description="Mandatory audit explanation for review decision")
    variant_label: Optional[str] = None
    variant_type: Optional[str] = "MODIFIED"

class EnrolVariantRequest(BaseModel):
    occurrence_id: Optional[str] = None
    variant_type: str = "MODIFIED"
    label: str
    reason: str
    reviewer: str

class RepresentativeGrantCreate(BaseModel):
    representative_email: str
    representative_name: Optional[str] = None
    incident_id: Optional[str] = "HC-2041"
    scopes: str = "SUBMIT,VIEW_MEDIA,REVIEW" # comma-separated
    duration_days: int = 7

class RepresentativeGrantResponse(BaseModel):
    id: str
    profile_id: str
    incident_id: Optional[str] = None
    representative_email: str
    representative_name: Optional[str] = None
    scopes: str
    invitation_url: Optional[str] = None
    status: str
    created_at: datetime
    expires_at: datetime
    revoked_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PairwiseCompareResponse(BaseModel):
    incident_id: str
    overall_match: bool
    recommended_state: str # "VERIFIED_RELATED", "REVIEW_REQUIRED", "UNRELATED"
    visual_similarity: float
    text_similarity: float
    signals: Dict[str, Any]
    calibration_version: str = "v2.0-geom"
    reasons: List[str]

class ScanRequestSchema(BaseModel):
    content_url: Optional[str] = None
    text_claim: Optional[str] = None
    profile_id: str = "PROF-8821"

class MatchResultSchema(BaseModel):
    incident_id: str
    similarity_score: float
    visual_score: float
    ocr_score: float
    text_score: float
    context_score: float
    risk_level: str
    recommendation: str
