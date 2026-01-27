from sqlmodel import Session, select
from app.models.user import User, UserCreate, UserResponse
from app.core.security import get_password_hash, create_access_token
from datetime import timedelta
from typing import Optional

def create_user(*, db: Session, user_create: UserCreate) -> UserResponse:
    """Create a new user in the database."""
    # Check if user with this email already exists
    existing_user = db.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise ValueError("Email already registered")

    try:
        # Create new user
        user = User(
            email=user_create.email,
            hashed_password=get_password_hash(user_create.password)
        )
    except Exception as e:
        # Handle bcrypt compatibility issues
        print(f"Bcrypt error: {e}")
        # Use a fallback hash or raise a more specific error
        from app.core.security import get_password_hash
        # This will trigger the error handling in get_password_hash
        hashed_pass = get_password_hash(user_create.password)
        user = User(
            email=user_create.email,
            hashed_password=hashed_pass
        )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Return user response (without password)
    return UserResponse(id=user.id, email=user.email, created_at=user.created_at)

def authenticate_user(*, db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = db.exec(select(User).where(User.email == email)).first()
    if not user or not user.hashed_password:
        return None

    if not user.hashed_password or not password:
        return None

    # Verify password
    from app.core.security import verify_password
    if not verify_password(password, user.hashed_password):
        return None

    return user

def create_auth_token(user_id: str) -> str:
    """Create an authentication token for the user."""
    access_token_expires = timedelta(minutes=30)  # 30 minutes
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    return access_token