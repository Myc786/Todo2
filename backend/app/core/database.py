from sqlmodel import Session
from app.core.config import settings
import os
from typing import Generator

# Create database engine (deferred until needed)
def get_engine():
    from sqlmodel import create_engine
    return create_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

def get_session() -> Generator[Session, None, None]:
    from sqlmodel import Session
    engine = get_engine()
    with Session(engine) as session:
        yield session