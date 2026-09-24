"""Short-lived local operator credentials. OIDC and MFA are not yet implemented."""
import hashlib
import secrets
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .db import get_db
from .models import User, Credential

bearer = HTTPBearer(auto_error=False)


def issue_credential(db, user, hours=8):
    token = secrets.token_urlsafe(48)
    db.add(Credential(user_id=user.id, digest=hashlib.sha256(token.encode()).hexdigest(),
                      expires_at=datetime.utcnow() + timedelta(hours=hours)))
    return token


def principal(auth: HTTPAuthorizationCredentials = Depends(bearer), db=Depends(get_db)):
    if not auth or len(auth.credentials) > 512:
        raise HTTPException(401, 'Authentication required', headers={'WWW-Authenticate': 'Bearer'})
    credential = db.query(Credential).filter_by(
        digest=hashlib.sha256(auth.credentials.encode()).hexdigest(), revoked=False).first()
    if not credential or credential.expires_at <= datetime.utcnow():
        raise HTTPException(401, 'Invalid or expired credential', headers={'WWW-Authenticate': 'Bearer'})
    user = db.get(User, credential.user_id)
    if not user or not user.active:
        raise HTTPException(401, 'Inactive account')
    return user


def writer(user=Depends(principal)):
    if user.role not in {'ADMIN', 'ANALYST'}:
        raise HTTPException(403, 'Write permission required')
    return user
