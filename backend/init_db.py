"""
Script to initialize the database with required tables
"""
import os
from dotenv import load_dotenv
load_dotenv()

from sqlmodel import SQLModel, create_engine
from app.core.config import settings
from app.models.user import User
from app.models.task import Task

def create_tables():
    print("Initializing database tables...")

    # Create engine with the configured database URL
    engine = create_engine(settings.DATABASE_URL, echo=True)

    # Create all tables
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")

    # Test the connection
    from sqlalchemy import text
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("Database connection test successful!")

    print("Database initialization complete!")

if __name__ == "__main__":
    create_tables()