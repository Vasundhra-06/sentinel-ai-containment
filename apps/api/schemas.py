from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OccurrenceSchema(BaseModel):
    id: str
    incident_id: str
    platform: str
    variant_type: str
    url: str
    account_handle: str
    detected_at: datetime
    similarity_score: float
    risk_level: str
    status: str
    sha256: str
    phash: str
    ocr_text: Optional[str] = None

    class Config:
        from_attributes = True

class IncidentSchema(BaseModel):
    id: str
    title: str
    profile_id: str
    status: str
    risk_score: int
    risk_level: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

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
