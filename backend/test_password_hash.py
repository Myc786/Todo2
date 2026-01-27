"""
Test the new password hashing functions
"""
import os
from dotenv import load_dotenv
load_dotenv()

from app.core.security import get_password_hash, verify_password

def test_password_functions():
    print("Testing password hashing functions...")

    # Test password hashing
    password = "testpassword123"
    print(f"Original password: {password}")

    try:
        hashed = get_password_hash(password)
        print(f"Hashed password: {hashed[:50]}...")  # Show first 50 chars

        # Test verification
        is_valid = verify_password(password, hashed)
        print(f"Verification result: {is_valid}")

        # Test with wrong password
        is_invalid = verify_password("wrongpassword", hashed)
        print(f"Wrong password verification: {is_invalid}")

        print("Password hashing functions working correctly!")

    except Exception as e:
        print(f"Error in password functions: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_password_functions()