"""
Simple test to verify the backend structure and imports work correctly
"""
import sys
import os
# Set TESTING environment variable to avoid config validation during import
os.environ["TESTING"] = "True"
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

try:
    # Test importing the main app
    from app.main import app
    print("SUCCESS: Successfully imported main FastAPI app")

    # Test importing core modules
    from app.core.config import settings
    print("SUCCESS: Successfully imported config settings")

    from app.core.database import get_session, get_engine
    print("SUCCESS: Successfully imported database components")

    from app.core.security import verify_password, get_password_hash, create_access_token
    print("SUCCESS: Successfully imported security utilities")

    # Test importing models
    from app.models.user import User, UserCreate, UserResponse
    print("SUCCESS: Successfully imported User models")

    from app.models.task import Task, TaskCreate, TaskUpdate, TaskResponse
    print("SUCCESS: Successfully imported Task models")

    # Test importing services
    from app.services.auth_service import create_user, authenticate_user
    print("SUCCESS: Successfully imported auth service")

    from app.services.task_service import create_task, get_user_tasks
    print("SUCCESS: Successfully imported task service")

    # Test importing API routers
    from app.api.api_router import api_router
    print("SUCCESS: Successfully imported API router")

    from app.api.v1.auth import router as auth_router
    print("SUCCESS: Successfully imported auth API router")

    from app.api.v1.tasks import router as tasks_router
    print("SUCCESS: Successfully imported tasks API router")

    print("\nALL IMPORTS SUCCESSFUL! Backend structure is valid.")
    print("\nTo run the backend server:")
    print("  cd backend")
    print("  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")

except ImportError as e:
    print(f"X Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"X Unexpected error: {e}")
    sys.exit(1)