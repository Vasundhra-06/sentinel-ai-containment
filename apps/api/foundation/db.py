import os
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parents[1]
DATABASE_URL = os.getenv('SENTINEL_DATABASE_URL', 'sqlite:///' + str(BASE_DIR / 'foundation.local.db'))


def make_engine(url):
    engine = create_engine(url, pool_pre_ping=True,
                           connect_args={'check_same_thread': False} if url.startswith('sqlite') else {})
    if url.startswith('sqlite'):
        @event.listens_for(engine, 'connect')
        def sqlite_constraints(connection, record):
            connection.execute('PRAGMA foreign_keys=ON')
    return engine


engine = make_engine(DATABASE_URL)
Base = declarative_base()
Session = sessionmaker(bind=engine, expire_on_commit=False)


def get_db():
    with Session() as session:
        yield session
