#!/usr/bin/env python3
"""
Debug script to test authentication functionality directly
"""

import sys
import traceback
from sqlmodel import Session, select
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the app directory to the path so we can import our modules
sys.path.insert(0, '.')

try:
    print("Importing modules...")

    # Import the necessary modules
    from app.core.database import get_engine, get_session
    from app.models.user import User, UserCreate
    from app.services.auth_service import create_user

    print("Modules imported successfully!")

    # Test database connection
    print("\nTesting database connection...")
    engine = get_engine()
    print(f"Engine created: {engine}")

    # Test session creation
    print("\nTesting session creation...")
    session_gen = get_session()
    session = next(session_gen)
    print("Session created successfully!")

    # Test a simple query
    print("\nTesting simple query...")
    users = session.exec(select(User)).all()
    print(f"Found {len(users)} users in database")

    # Test creating a user
    print("\nTesting user creation...")
    user_data = UserCreate(email="test@example.com", password="testpassword123")

    try:
        created_user = create_user(db=session, user_create=user_data)
        print(f"User created successfully: {created_user}")
    except Exception as e:
        print(f"Error creating user: {e}")
        traceback.print_exc()

    session.close()

except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()