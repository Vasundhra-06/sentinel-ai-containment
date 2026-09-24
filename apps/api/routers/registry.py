from fastapi import APIRouter, Depends, HTTPException, Query, Header
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/v1/registry", tags=["registry"])

@router.get("/items", response_model=List[schemas.FingerprintRegistryItemSchema])
def list_registry_items(
    status: Optional[str] = Query(None, description="ACTIVE, REVOKED, EXPIRED"),
    algorithm: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.FingerprintRegistryItem)
    if status:
        query = query.filter(models.FingerprintRegistryItem.status == status.upper())
    if algorithm:
        query = query.filter(models.FingerprintRegistryItem.algorithm == algorithm.upper())
    return query.all()

@router.get("/feed")
def get_partner_incremental_feed(
    partner_id: str = Query(..., description="Registered partner identifier"),
    cursor: Optional[str] = Query(None, description="Cursor timestamp for incremental delta sync"),
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db)
):
    """
    Cursor-based incremental synchronization feed for subscribed safety partners.
    Never exports evidence vault, PII, or victim identities.
    """
    partner = db.query(models.PartnerSubscription).filter(models.PartnerSubscription.partner_id == partner_id).first()
    if not partner or not partner.is_active:
        raise HTTPException(status_code=403, detail="Unauthorized or inactive partner subscription.")

    allowed_algs = [a.strip().upper() for a in partner.subscribed_algorithms.split(",")]

    query = db.query(models.FingerprintRegistryItem).filter(
        models.FingerprintRegistryItem.status == "ACTIVE",
        models.FingerprintRegistryItem.algorithm.in_(allowed_algs)
    )

    if cursor:
        try:
            cursor_dt = datetime.utcfromtimestamp(float(cursor))
            query = query.filter(models.FingerprintRegistryItem.created_at > cursor_dt)
        except Exception:
            pass

    items = query.order_by(models.FingerprintRegistryItem.created_at.asc()).limit(limit).all()

    next_cursor = None
    if items:
        next_cursor = str(int(items[-1].created_at.timestamp()))

    # Update partner sync metadata
    partner.last_synced_at = datetime.utcnow()
    partner.last_sync_cursor = next_cursor or cursor
    db.commit()

    return {
        "partner_id": partner_id,
        "delta_count": len(items),
        "cursor": next_cursor,
        "items": [
            {
                "opaque_id": item.opaque_id,
                "algorithm": item.algorithm,
                "version": item.version,
                "format": item.format,
                "fingerprint_value": item.fingerprint_value,
                "authorization_scope": item.authorization_scope,
                "revision": item.revision,
                "status": item.status,
                "created_at": item.created_at.isoformat()
            }
            for item in items
        ]
    }

@router.post("/ack")
def acknowledge_sync(
    partner_id: str = Query(...),
    cursor: str = Query(...),
    db: Session = Depends(get_db)
):
    partner = db.query(models.PartnerSubscription).filter(models.PartnerSubscription.partner_id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found.")

    partner.last_sync_cursor = cursor
    partner.last_synced_at = datetime.utcnow()
    db.commit()
    return {"status": "acknowledged", "partner_id": partner_id, "cursor": cursor}

@router.get("/revocations")
def get_revocations_stream(
    since_cursor: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Returns stream of versioned fingerprint revocations to notify partners of removed items.
    """
    query = db.query(models.FingerprintRegistryItem).filter(models.FingerprintRegistryItem.status == "REVOKED")
    if since_cursor:
        try:
            cursor_dt = datetime.utcfromtimestamp(float(since_cursor))
            query = query.filter(models.FingerprintRegistryItem.revoked_at > cursor_dt)
        except Exception:
            pass

    revoked = query.order_by(models.FingerprintRegistryItem.revoked_at.desc()).all()
    return {
        "revocation_count": len(revoked),
        "revocations": [
            {
                "opaque_id": r.opaque_id,
                "algorithm": r.algorithm,
                "revoked_at": r.revoked_at.isoformat() if r.revoked_at else None,
                "action": "INVALIDATE_CACHE_AND_INDEX"
            }
            for r in revoked
        ]
    }
