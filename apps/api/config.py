"""Fail-closed development configuration; production launch remains gated."""
import os
from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass(frozen=True)
class Settings:
    environment: str
    legacy_demo: bool
    origins: tuple

    @classmethod
    def from_env(cls):
        environment = os.getenv('ENVIRONMENT', 'development').lower()
        if environment not in {'development', 'test', 'production'}:
            raise ValueError('Invalid ENVIRONMENT')
        demo = os.getenv('SENTINEL_LEGACY_DEMO', 'false').lower() == 'true'
        origins = tuple(x.strip() for x in os.getenv(
            'ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000'
        ).split(',') if x.strip())
        for value in origins:
            url = urlparse(value)
            if (url.scheme not in {'http', 'https'} or not url.netloc or '*' in value
                    or url.path or url.query or url.fragment or url.username):
                raise ValueError('ALLOWED_ORIGINS must contain explicit HTTP(S) origins')
        if not origins:
            raise ValueError('ALLOWED_ORIGINS must not be empty')
        if environment == 'production':
            raise ValueError('Production launch requires the pending identity, vault and operations gates')
        return cls(environment, demo, origins)
