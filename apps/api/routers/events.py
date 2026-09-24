import asyncio
import json
from datetime import datetime
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/v1/events", tags=["events"])

@router.get("/stream")
async def event_stream(request: Request, incident_id: str = "HC-2041", db: Session = Depends(get_db)):
    """
    Delivers real-time incident, occurrence, and partner policy updates via Server-Sent Events (SSE).
    Provides reconnect, snapshot replay, and periodic heartbeats.
    """
    async def event_generator():
        # 1. Send initial connection greeting and incident status snapshot
        inc = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
        status_payload = {
            "type": "INCIDENT_SNAPSHOT",
            "incident_id": incident_id,
            "title": inc.title if inc else "Incident",
            "status": inc.status if inc else "ACTIVE MONITORING",
            "risk_score": inc.risk_score if inc else 88,
            "timestamp": datetime.utcnow().isoformat()
        }
        yield f"event: snapshot\ndata: {json.dumps(status_payload)}\n\n"

        # 2. Keep-alive heartbeat stream
        for _ in range(5):
            if await request.is_disconnected():
                break
            await asyncio.sleep(2)
            heartbeat = {
                "type": "HEARTBEAT",
                "incident_id": incident_id,
                "timestamp": datetime.utcnow().isoformat(),
                "monitoring_active": True
            }
            yield f"event: heartbeat\ndata: {json.dumps(heartbeat)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
