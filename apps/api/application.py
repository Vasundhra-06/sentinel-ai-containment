from ipaddress import ip_address
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from config import Settings
from foundation.routes import router
from foundation.db import engine


def create_app(settings=None):
    settings = settings or Settings.from_env()
    app = FastAPI(title='SENTINEL local development API', version='3.0.0-dev')
    app.add_middleware(CORSMiddleware, allow_origins=list(settings.origins),
                       allow_credentials=False, allow_methods=['GET', 'POST', 'PUT', 'DELETE'],
                       allow_headers=['Authorization', 'Content-Type'])
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=['localhost', '127.0.0.1', '[::1]'])

    @app.middleware('http')
    async def local_safety_boundary(request, call_next):
        origin = request.headers.get('origin')
        if origin and origin not in settings.origins:
            return JSONResponse({'detail': 'Origin not allowed'}, status_code=403)
        if request.url.path.startswith('/api/v1'):
            try:
                local = ip_address(request.client.host).is_loopback
            except (ValueError, AttributeError):
                local = False
            if not settings.legacy_demo or not local:
                return JSONResponse({'detail': 'Legacy API requires explicit loopback demo mode'}, status_code=403)
        response = await call_next(request)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['Cache-Control'] = 'no-store'
        return response

    # Migrations are an explicit command. Default startup never imports ML or legacy tables.
    app.include_router(router)
    if settings.legacy_demo:
        from routers import incidents, detections, evidence, profiles, compare, registry, partner_demo, access, events, platforms
        for module in (incidents, detections, evidence, profiles, compare, registry, partner_demo, access, events, platforms):
            app.include_router(module.router)

    @app.get('/')
    def root():
        return {'system': 'SENTINEL', 'status': 'ONLINE', 'version': '3.0.0-dev',
                'mode': 'LOCAL_DEMO' if settings.legacy_demo else 'FOUNDATION',
                'production_ready': False, 'capabilities': {
                    'authenticated_case_api': 'AVAILABLE', 'external_platform_actions': 'NOT_CONFIGURED',
                    'legacy_platforms': 'SIMULATED' if settings.legacy_demo else 'DISABLED',
                    'continuous_monitoring': 'NOT_IMPLEMENTED',
                    'evidence_vault': 'NOT_IMPLEMENTED', 'mfa': 'NOT_IMPLEMENTED'}}

    @app.get('/health/live')
    def health():
        return {'status': 'alive'}

    @app.get('/health/ready')
    def ready():
        try:
            with engine.connect() as connection:
                revision = connection.execute(text('SELECT version_num FROM sentinel_schema_version')).scalar()
                if revision != '0001_foundation':
                    raise ValueError('Wrong schema version')
        except Exception:
            return JSONResponse({'status': 'not_ready', 'detail': 'Run foundation migrations'}, status_code=503)
        return {'status': 'ready', 'schema': revision}

    return app
