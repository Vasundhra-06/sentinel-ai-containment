"""Isolated tenant foundation. No legacy table is modified."""
from alembic import op
import sqlalchemy as sa

revision = '0001_foundation'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('v2_tenants', sa.Column('id', sa.String(36), primary_key=True),
                    sa.Column('name', sa.String(160), nullable=False), sa.Column('created_at', sa.DateTime(), nullable=False))
    op.create_table('v2_users', sa.Column('id', sa.String(36), primary_key=True),
                    sa.Column('tenant_id', sa.String(36), sa.ForeignKey('v2_tenants.id'), nullable=False),
                    sa.Column('name', sa.String(160), nullable=False), sa.Column('role', sa.String(16), nullable=False),
                    sa.Column('active', sa.Boolean(), nullable=False),
                    sa.CheckConstraint("role IN ('ADMIN','ANALYST','VIEWER')", name='v2_user_role'))
    op.create_index('ix_v2_users_tenant_id', 'v2_users', ['tenant_id'])
    op.create_table('v2_credentials', sa.Column('id', sa.String(36), primary_key=True),
                    sa.Column('user_id', sa.String(36), sa.ForeignKey('v2_users.id'), nullable=False),
                    sa.Column('digest', sa.String(64), nullable=False, unique=True),
                    sa.Column('expires_at', sa.DateTime(), nullable=False), sa.Column('revoked', sa.Boolean(), nullable=False))
    op.create_table('v2_cases', sa.Column('id', sa.String(36), primary_key=True),
                    sa.Column('tenant_id', sa.String(36), sa.ForeignKey('v2_tenants.id'), nullable=False),
                    sa.Column('title', sa.String(200), nullable=False), sa.Column('category', sa.String(24), nullable=False),
                    sa.Column('status', sa.String(24), nullable=False), sa.Column('created_at', sa.DateTime(), nullable=False),
                    sa.UniqueConstraint('tenant_id', 'id', name='v2_case_tenant_id'),
                    sa.CheckConstraint("category IN ('IMPERSONATION','HARASSMENT','COPYRIGHT','OTHER')", name='v2_case_category'),
                    sa.CheckConstraint("status IN ('INTAKE','CLOSED')", name='v2_case_status'))
    op.create_index('ix_v2_cases_tenant_id', 'v2_cases', ['tenant_id'])
    op.create_table('v2_audit_events', sa.Column('id', sa.String(36), primary_key=True),
                    sa.Column('tenant_id', sa.String(36), sa.ForeignKey('v2_tenants.id'), nullable=False),
                    sa.Column('actor_id', sa.String(36), sa.ForeignKey('v2_users.id'), nullable=False),
                    sa.Column('action', sa.String(80), nullable=False), sa.Column('subject_id', sa.String(36), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False))
    op.create_index('ix_v2_audit_events_tenant_id', 'v2_audit_events', ['tenant_id'])


def downgrade():
    tables = ('v2_audit_events', 'v2_cases', 'v2_credentials', 'v2_users', 'v2_tenants')
    for table in tables:
        if op.get_bind().execute(sa.text('SELECT COUNT(*) FROM ' + table)).scalar():
            raise RuntimeError('Refusing destructive downgrade: foundation contains data; restore a verified backup')
    for table in tables:
        op.drop_table(table)
