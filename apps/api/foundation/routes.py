from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field, ConfigDict
from .db import get_db
from .models import Case, AuditEvent, Credential
from .security import principal, writer

router = APIRouter(prefix='/api/v2', tags=['Authenticated foundation'])


class CaseInput(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)
    title: str = Field(min_length=3, max_length=200)
    category: Literal['IMPERSONATION', 'HARASSMENT', 'COPYRIGHT', 'OTHER']


def case_json(case):
    return {'id': case.id, 'title': case.title, 'category': case.category,
            'status': case.status, 'created_at': case.created_at.isoformat(),
            'authority_status': 'NOT_VERIFIED', 'actionability': 'NOT_REVIEWED'}


@router.get('/me')
def me(user=Depends(principal)):
    return {'id': user.id, 'tenant_id': user.tenant_id, 'name': user.name, 'role': user.role}


@router.get('/cases')
def cases(offset: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
          user=Depends(principal), db=Depends(get_db)):
    return [case_json(c) for c in db.query(Case).filter_by(tenant_id=user.tenant_id)
            .order_by(Case.created_at.desc(), Case.id).offset(offset).limit(limit)]


@router.post('/cases', status_code=201)
def create_case(payload: CaseInput, user=Depends(writer), db=Depends(get_db)):
    case = Case(tenant_id=user.tenant_id, title=payload.title, category=payload.category)
    db.add(case)
    db.flush()
    db.add(AuditEvent(tenant_id=user.tenant_id, actor_id=user.id,
                      action='CASE_CREATED', subject_id=case.id))
    db.commit()
    return case_json(case)


@router.get('/cases/{case_id}')
def get_case(case_id: str, user=Depends(principal), db=Depends(get_db)):
    case = db.query(Case).filter_by(id=case_id, tenant_id=user.tenant_id).first()
    if not case:
        raise HTTPException(404, 'Case not found')
    return case_json(case)


@router.get('/audit')
def audit(user=Depends(principal), db=Depends(get_db)):
    if user.role != 'ADMIN':
        raise HTTPException(403, 'Administrator permission required')
    return [{'id': e.id, 'actor_id': e.actor_id, 'action': e.action,
             'subject_id': e.subject_id, 'created_at': e.created_at.isoformat()}
            for e in db.query(AuditEvent).filter_by(tenant_id=user.tenant_id)
            .order_by(AuditEvent.created_at.desc(), AuditEvent.id).limit(100)]


@router.post('/credentials/revoke-all', status_code=204)
def revoke_credentials(user=Depends(principal), db=Depends(get_db)):
    db.query(Credential).filter_by(user_id=user.id).update({'revoked': True})
    db.add(AuditEvent(tenant_id=user.tenant_id, actor_id=user.id,
                      action='OWN_CREDENTIALS_REVOKED', subject_id=user.id))
    db.commit()
