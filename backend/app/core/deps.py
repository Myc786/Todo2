from fastapi import Depends, HTTPException, status, Request
from sqlmodel import Session
from typing import Generator

from app.core.database import get_session, get_engine
from app.core.security import verify_token
from app.models.user import User

def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    engine = get_engine()
    with Session(engine) as session:
        yield session

def get_current_user(request: Request) -> User:
    """Dependency to get current user from JWT token in Authorization header."""
    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.split(" ")[1]  # Get the token part after "Bearer "

    # Verify the token
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user ID from token
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # In a real implementation, we would fetch the user from the database
    # For now, we'll just return a placeholder
    # This will be updated when we implement the full authentication service

    # Import here to avoid circular imports
    from sqlmodel import select
    with next(get_session()) as session:
        statement = select(User).where(User.id == user_id)
        db_user = session.exec(statement).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return db_user