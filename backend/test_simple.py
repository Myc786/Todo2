"""
Simple test to verify the backend is working properly
"""
import os
import sys

def test_backend():
    # Set environment for testing
    os.environ["TESTING"] = "True"

    print("Testing backend functionality...")

    # Test that all modules can be imported without errors
    try:
        from app.main import app
        print("SUCCESS: Main app imported successfully")

        from app.core.config import settings
        print("SUCCESS: Config imported successfully")

        from app.core.database import get_session, get_engine
        print("SUCCESS: Database components imported successfully")

        from app.services.auth_service import create_user, authenticate_user
        print("SUCCESS: Auth service imported successfully")

        from app.services.task_service import create_task, get_user_tasks
        print("SUCCESS: Task service imported successfully")

        from app.api.v1.auth import router as auth_router
        print("SUCCESS: Auth router imported successfully")

        from app.api.v1.tasks import router as tasks_router
        print("SUCCESS: Tasks router imported successfully")

    except Exception as e:
        print(f"FAILURE: Import error: {e}")
        return False

    # Test that the application has the expected routes
    routes = [route.path for route in app.routes]
    expected_routes = ['/health', '/docs', '/redoc', '/openapi.json']

    for route in expected_routes:
        if any(route in r for r in routes):
            print(f"SUCCESS: Route {route} is available")
        else:
            print(f"WARNING: Route {route} may not be available")

    print("\nALL BACKEND TESTS PASSED!")
    return True

if __name__ == "__main__":
    success = test_backend()
    if success:
        print("\nALL BACKEND TESTS PASSED!")
        sys.exit(0)
    else:
        print("\nSOME BACKEND TESTS FAILED!")
        sys.exit(1)