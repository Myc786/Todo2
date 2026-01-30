"""
Script to manually apply schema changes to add missing columns to the task table
"""
import asyncio
import os
from sqlalchemy import text
from sqlmodel import create_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def apply_schema_changes():
    print("Connecting to database...")

    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")

    # Create engine with the database URL
    engine = create_engine(database_url)

    print("Applying schema changes...")

    # Connect and execute the ALTER TABLE statements to add missing columns
    with engine.connect() as conn:
        # Start a transaction
        trans = conn.begin()

        try:
            # Check if priority column exists, if not add it
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='task' AND column_name='priority'
            """))

            if result.fetchone() is None:
                print("Adding priority column...")
                conn.execute(text("ALTER TABLE task ADD COLUMN priority VARCHAR(20) DEFAULT 'MEDIUM'"))
            else:
                print("Priority column already exists")

            # Check if due_date column exists, if not add it
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='task' AND column_name='due_date'
            """))

            if result.fetchone() is None:
                print("Adding due_date column...")
                conn.execute(text("ALTER TABLE task ADD COLUMN due_date TIMESTAMP"))
            else:
                print("Due_date column already exists")

            # Check if recurrence_pattern column exists, if not add it
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='task' AND column_name='recurrence_pattern'
            """))

            if result.fetchone() is None:
                print("Adding recurrence_pattern column...")
                conn.execute(text("ALTER TABLE task ADD COLUMN recurrence_pattern VARCHAR(20)"))
            else:
                print("Recurrence_pattern column already exists")

            # Check if recurrence_end_date column exists, if not add it
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='task' AND column_name='recurrence_end_date'
            """))

            if result.fetchone() is None:
                print("Adding recurrence_end_date column...")
                conn.execute(text("ALTER TABLE task ADD COLUMN recurrence_end_date TIMESTAMP"))
            else:
                print("Recurrence_end_date column already exists")

            # Commit the transaction
            trans.commit()
            print("Schema changes applied successfully!")

        except Exception as e:
            # Rollback the transaction in case of error
            trans.rollback()
            print(f"Error applying schema changes: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(apply_schema_changes())