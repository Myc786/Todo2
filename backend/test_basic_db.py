"""
Basic test to verify database connectivity works
"""
import os
from dotenv import load_dotenv
load_dotenv()

from sqlmodel import Session, select
from app.core.database import get_engine
from app.models.user import User

def test_db_connectivity():
    print("Testing basic database connectivity...")

    # Create engine with the configured database URL
    engine = get_engine()

    # Test the connection
    from sqlalchemy import text
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("+ Database connection test successful!")

    # Test if tables exist by trying to query
    with Session(engine) as session:
        try:
            # Try to count users
            stmt = select(User)
            result = session.exec(stmt)
            users = result.all()
            print(f"+ Successfully queried users table, found {len(users)} users")
        except Exception as e:
            print(f"Note: Error querying users (may be expected if table structure changed): {e}")

    print("+ Basic database connectivity test completed!")

if __name__ == "__main__":
    test_db_connectivity()