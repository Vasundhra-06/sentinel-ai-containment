from alembic import context
from foundation.db import Base, make_engine, DATABASE_URL
from foundation import models


def run(connection=None):
    context.configure(connection=connection, url=DATABASE_URL if connection is None else None,
                      target_metadata=Base.metadata, version_table='sentinel_schema_version',
                      literal_binds=connection is None)
    with context.begin_transaction():
        context.run_migrations()


if context.is_offline_mode():
    run()
elif context.config.attributes.get('connection') is not None:
    run(context.config.attributes['connection'])
else:
    engine = make_engine(DATABASE_URL)
    with engine.connect() as connection:
        run(connection)
    engine.dispose()
