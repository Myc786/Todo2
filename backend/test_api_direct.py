"""
Test the API endpoints directly
"""
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi.testclient import TestClient
from app.main import app

def test_api_endpoints():
    print("Testing API endpoints directly...")

    client = TestClient(app)

    # Test health endpoint
    response = client.get("/health")
    print(f"Health endpoint: {response.status_code}, {response.json()}")

    # Test root endpoint
    response = client.get("/")
    print(f"Root endpoint: {response.status_code}, {response.json()}")

    # Test signup endpoint
    signup_data = {
        "email": "test@example.com",
        "password": "shortpass123"
    }

    try:
        response = client.post("/api/v1/auth/", json=signup_data)
        print(f"Signup endpoint: {response.status_code}")
        if response.status_code != 200:
            print(f"Response: {response.text}")
        else:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error calling signup endpoint: {e}")
        import traceback
        traceback.print_exc()

    # Test login endpoint
    login_data = {
        "email": "test@example.com",
        "password": "shortpass123"
    }

    try:
        response = client.post("/api/v1/auth/signin", data=login_data)
        print(f"Signin endpoint: {response.status_code}")
        if response.status_code != 200:
            print(f"Response: {response.text}")
        else:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error calling signin endpoint: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_endpoints()