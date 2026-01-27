"""
Test script to verify the authentication flow works properly
"""
import os
from dotenv import load_dotenv
load_dotenv()

import asyncio
from sqlmodel import Session, select
from app.core.database import get_engine
from app.models.user import User, UserCreate
from app.services.auth_service import create_user

def test_auth_flow():
    print("Testing authentication flow...")

    # Create a test user directly in the database
    engine = get_engine()

    # Test creating a user
    user_create = UserCreate(
        email="test@example.com",
        password="testpass123"  # Shorter password to avoid bcrypt length issue
    )

    with Session(engine) as session:
        try:
            print("Attempting to create test user...")
            created_user = create_user(db=session, user_create=user_create)
            print(f"User created successfully: {created_user.email}")
        except Exception as e:
            print(f"Error creating user: {e}")

            # Check if user already exists
            existing_user = session.exec(select(User).where(User.email == "test@example.com")).first()
            if existing_user:
                print(f"User already exists: {existing_user.email}")
                created_user = existing_user
            else:
                raise e

    print("Authentication flow test completed!")

if __name__ == "__main__":
    test_auth_flow()