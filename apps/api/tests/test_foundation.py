"""Security boundaries exercised through HTTP against migrated disposable databases."""
import hashlib
import sqlite3
import sys
from datetime import datetime, timedelta
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from fastapi.testclient import TestClient
from sqlalchemy import inspect, text
from sqlalchemy.orm import sessionmaker

API = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(API))
from config import Settings
from application import create_app
from foundation.db import make_engine, get_db, Base
from foundation.models import Tenant, User, Credential, Case
from foundation.security import issue_credential


def migrate(engine, action='upgrade'):
    config = Config(str(API / 'alembic.ini'))
    with engine.begin() as connection:
        config.attributes['connection'] = connection
        getattr(command, action)(config, 'head' if action == 'upgrade' else 'base')


@pytest.fixture
def harness(tmp_path, monkeypatch):
    path = tmp_path / 'test.db'
    engine = make_engine('sqlite:///' + str(path))
    migrate(engine)
    factory = sessionmaker(bind=engine, expire_on_commit=False)
    tokens, ids = {}, {}
    with factory() as db:
        for tenant_name in ('A', 'B'):
            tenant = Tenant(name=tenant_name)
            db.add(tenant)
            db.flush()
            for role in ('ADMIN', 'ANALYST', 'VIEWER'):
                user = User(tenant_id=tenant.id, name=tenant_name + role, role=role)
                db.add(user)
                db.flush()
                key = tenant_name + role
                tokens[key], ids[key] = issue_credential(db, user), user.id
        db.commit()
    app = create_app(Settings('test', False, ('http://localhost:3000',)))
    def database():
        with factory() as db:
            yield db
    app.dependency_overrides[get_db] = database
    monkeypatch.setattr('application.engine', engine)
    with TestClient(app, base_url='http://localhost') as client:
        yield client, tokens, ids, factory, engine, path
    engine.dispose()


def auth(token):
    return {'Authorization': 'Bearer ' + token}


@pytest.mark.parametrize('path', ['/api/v2/me', '/api/v2/cases', '/api/v2/audit'])
def test_requires_authentication(harness, path):
    client, tokens, *_ = harness
    assert client.get(path).status_code == 401
    assert client.get(path, headers=auth('invented')).status_code == 401


def test_tenant_isolation_and_atomic_audit(harness):
    client, tokens, *_ = harness
    created = client.post('/api/v2/cases', headers=auth(tokens['AADMIN']),
                          json={'title': 'Authorized case', 'category': 'IMPERSONATION'})
    assert created.status_code == 201
    case = created.json()
    assert case['authority_status'] == 'NOT_VERIFIED'
    assert case['actionability'] == 'NOT_REVIEWED'
    assert client.get('/api/v2/cases', headers=auth(tokens['BADMIN'])).json() == []
    assert client.get('/api/v2/cases/' + case['id'], headers=auth(tokens['BADMIN'])).status_code == 404
    assert client.get('/api/v2/cases/' + case['id'], headers=auth(tokens['AADMIN'])).status_code == 200
    events = client.get('/api/v2/audit', headers=auth(tokens['AADMIN'])).json()
    assert [(e['action'], e['subject_id']) for e in events] == [('CASE_CREATED', case['id'])]
    assert client.get('/api/v2/audit', headers=auth(tokens['BADMIN'])).json() == []


def test_roles_and_payload_cannot_select_tenant(harness):
    client, tokens, *_ = harness
    payload = {'title': 'A valid case', 'category': 'COPYRIGHT'}
    assert client.post('/api/v2/cases', headers=auth(tokens['AVIEWER']), json=payload).status_code == 403
    assert client.get('/api/v2/audit', headers=auth(tokens['AANALYST'])).status_code == 403
    assert client.post('/api/v2/cases', headers=auth(tokens['AANALYST']), json=payload).status_code == 201
    for extra in ({'tenant_id': 'B'}, {'id': 'HC-2041'}, {'status': 'REMOVED'}):
        assert client.post('/api/v2/cases', headers=auth(tokens['AADMIN']), json={**payload, **extra}).status_code == 422
    assert client.post('/api/v2/cases', headers=auth(tokens['AADMIN']), json={**payload, 'title': '   '}).status_code == 422


@pytest.mark.parametrize('failure', ['expired', 'revoked', 'inactive'])
def test_credential_invalidation(harness, failure):
    client, tokens, ids, factory, *_ = harness
    with factory() as db:
        credential = db.query(Credential).filter_by(user_id=ids['AADMIN']).one()
        assert credential.digest != tokens['AADMIN']
        if failure == 'expired':
            credential.expires_at = datetime.utcnow() - timedelta(seconds=1)
        elif failure == 'revoked':
            credential.revoked = True
        else:
            db.get(User, ids['AADMIN']).active = False
        db.commit()
    assert client.get('/api/v2/me', headers=auth(tokens['AADMIN'])).status_code == 401


def test_revoke_all_does_not_revoke_another_operator(harness):
    client, tokens, *_ = harness
    assert client.post('/api/v2/credentials/revoke-all', headers=auth(tokens['AADMIN'])).status_code == 204
    assert client.get('/api/v2/me', headers=auth(tokens['AADMIN'])).status_code == 401
    assert client.get('/api/v2/me', headers=auth(tokens['BADMIN'])).status_code == 200


def test_legacy_origin_and_host_boundaries(harness):
    client, tokens, *_ = harness
    assert client.get('/api/v1/incidents', headers=auth(tokens['AADMIN'])).status_code == 403
    assert client.get('/api/v2/cases', headers={**auth(tokens['AADMIN']), 'Origin': 'https://attacker.example'}).status_code == 403
    assert client.get('/', headers={'Host': 'attacker.example'}).status_code == 400
    response = client.options('/api/v2/cases', headers={'Origin': 'http://localhost:3000',
                                                     'Access-Control-Request-Method': 'POST',
                                                     'Access-Control-Request-Headers': 'Authorization,Content-Type'})
    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == 'http://localhost:3000'
    assert client.get('/health/ready').status_code == 200
    assert client.get('/').json()['production_ready'] is False


def test_configuration_rejects_unsafe_deployment(monkeypatch):
    monkeypatch.setenv('ALLOWED_ORIGINS', '*')
    with pytest.raises(ValueError):
        Settings.from_env()
    monkeypatch.setenv('ALLOWED_ORIGINS', 'http://localhost:3000')
    monkeypatch.setenv('ENVIRONMENT', 'production')
    with pytest.raises(ValueError, match='Production launch'):
        Settings.from_env()


def test_schema_matches_models_and_refuses_data_loss(harness):
    _, _, _, factory, engine, _ = harness
    with engine.connect() as connection:
        context = MigrationContext.configure(connection, opts={'version_table': 'sentinel_schema_version'})
        assert compare_metadata(context, Base.metadata) == []
    with pytest.raises(RuntimeError, match='Refusing destructive downgrade'):
        migrate(engine, 'downgrade')
    with factory() as db:
        assert db.query(Tenant).count() == 2


def test_empty_upgrade_rollback_preserves_legacy(tmp_path):
    engine = make_engine('sqlite:///' + str(tmp_path / 'migration.db'))
    with engine.begin() as connection:
        connection.execute(text('CREATE TABLE legacy_marker (value TEXT)'))
        connection.execute(text("INSERT INTO legacy_marker VALUES ('preserve')"))
    migrate(engine)
    migrate(engine, 'downgrade')
    with engine.connect() as connection:
        assert connection.execute(text('SELECT value FROM legacy_marker')).scalar() == 'preserve'
    assert 'v2_cases' not in inspect(engine).get_table_names()
    migrate(engine)
    assert 'v2_cases' in inspect(engine).get_table_names()
    engine.dispose()


def test_sqlite_backup_restore(harness, tmp_path):
    client, tokens, _, _, _, path = harness
    case = client.post('/api/v2/cases', headers=auth(tokens['AADMIN']),
                       json={'title': 'Restore me', 'category': 'OTHER'}).json()
    backup_path = tmp_path / 'restore.db'
    with sqlite3.connect(str(path)) as source, sqlite3.connect(str(backup_path)) as backup:
        source.backup(backup)
    with sqlite3.connect(str(backup_path)) as restored:
        assert restored.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
        assert restored.execute('SELECT title FROM v2_cases WHERE id=?', (case['id'],)).fetchone()[0] == 'Restore me'
        assert restored.execute('SELECT COUNT(*) FROM v2_audit_events').fetchone()[0] == 1
