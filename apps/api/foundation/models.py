from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, UniqueConstraint, CheckConstraint
from .db import Base


def new_id():
    return str(uuid4())


class Tenant(Base):
    __tablename__ = 'v2_tenants'
    id = Column(String(36), primary_key=True, default=new_id)
    name = Column(String(160), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class User(Base):
    __tablename__ = 'v2_users'
    id = Column(String(36), primary_key=True, default=new_id)
    tenant_id = Column(String(36), ForeignKey('v2_tenants.id'), nullable=False, index=True)
    name = Column(String(160), nullable=False)
    role = Column(String(16), nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    __table_args__ = (CheckConstraint("role IN ('ADMIN','ANALYST','VIEWER')", name='v2_user_role'),)


class Credential(Base):
    __tablename__ = 'v2_credentials'
    id = Column(String(36), primary_key=True, default=new_id)
    user_id = Column(String(36), ForeignKey('v2_users.id'), nullable=False)
    digest = Column(String(64), nullable=False, unique=True)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, nullable=False, default=False)


class Case(Base):
    __tablename__ = 'v2_cases'
    id = Column(String(36), primary_key=True, default=new_id)
    tenant_id = Column(String(36), ForeignKey('v2_tenants.id'), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(24), nullable=False)
    status = Column(String(24), nullable=False, default='INTAKE')
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint('tenant_id', 'id', name='v2_case_tenant_id'),
                     CheckConstraint("category IN ('IMPERSONATION','HARASSMENT','COPYRIGHT','OTHER')", name='v2_case_category'),
                     CheckConstraint("status IN ('INTAKE','CLOSED')", name='v2_case_status'))


class AuditEvent(Base):
    __tablename__ = 'v2_audit_events'
    id = Column(String(36), primary_key=True, default=new_id)
    tenant_id = Column(String(36), ForeignKey('v2_tenants.id'), nullable=False, index=True)
    actor_id = Column(String(36), ForeignKey('v2_users.id'), nullable=False)
    action = Column(String(80), nullable=False)
    subject_id = Column(String(36), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
