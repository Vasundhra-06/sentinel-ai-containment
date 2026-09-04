from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
import models
from datetime import datetime

router = APIRouter(prefix="/api/v1/profiles", tags=["profiles"])

class ProfileUpdateSchema(BaseModel):
    full_name: str
    organization: Optional[str] = "Independent Creator & Research"
    profession: Optional[str] = "Research Scientist & Content Creator"
    handles: str

@router.get("/current")
def get_current_profile(db: Session = Depends(get_db)):
    """Fetches the active protected profile from SQLite or seeds default if empty."""
    profile = db.query(models.ProtectedProfile).first()
    if not profile:
        profile = models.ProtectedProfile(
            id="PROF-8821",
            full_name="Dr. Evelyn Carter",
            organization="Department of Biochemistry & Independent Media",
            handles="@evelyn_carter, @drcarter_bio",
            created_at=datetime.utcnow()
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "organization": profile.organization or "Independent Creator & Research",
        "profession": "Research Scientist & Content Creator",
        "handles": profile.handles or "@evelyn_carter, @drcarter_bio",
        "is_protected": True,
        "created_at": str(profile.created_at)
    }

@router.put("/current")
def update_current_profile(payload: ProfileUpdateSchema, db: Session = Depends(get_db)):
    """Updates the active protected profile in SQLite."""
    profile = db.query(models.ProtectedProfile).first()
    if not profile:
        profile = models.ProtectedProfile(
            id="PROF-8821",
            full_name=payload.full_name,
            organization=payload.organization,
            handles=payload.handles,
            created_at=datetime.utcnow()
        )
        db.add(profile)
    else:
        profile.full_name = payload.full_name
        profile.organization = payload.organization
        profile.handles = payload.handles
    
    db.commit()
    db.refresh(profile)

    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "organization": profile.organization,
        "profession": payload.profession,
        "handles": profile.handles,
        "is_protected": True,
        "status": "UPDATED_SUCCESSFULLY"
    }
