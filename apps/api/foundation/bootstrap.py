"""Explicit local CLI provisioning; no public signup or default credentials."""
import argparse
from .db import Session
from .models import Tenant, User, AuditEvent
from .security import issue_credential


def main():
    parser = argparse.ArgumentParser(description='Provision a local tenant and 8-hour operator token')
    parser.add_argument('--tenant', required=True)
    parser.add_argument('--name', required=True)
    args = parser.parse_args()
    if not 1 <= len(args.tenant.strip()) <= 160 or not 1 <= len(args.name.strip()) <= 160:
        parser.error('Tenant and name must contain 1-160 characters')
    with Session() as db:
        tenant = Tenant(name=args.tenant.strip())
        db.add(tenant)
        db.flush()
        user = User(tenant_id=tenant.id, name=args.name.strip(), role='ADMIN')
        db.add(user)
        db.flush()
        token = issue_credential(db, user)
        db.add(AuditEvent(tenant_id=tenant.id, actor_id=user.id,
                          action='LOCAL_TENANT_PROVISIONED', subject_id=tenant.id))
        db.commit()
        print('Private local operator token (expires in 8 hours):')
        print(token)


if __name__ == '__main__':
    main()
