from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlmodel import Session
from app.services.auth_service import create_user, authenticate_user, create_auth_token
from app.models.user import UserCreate, UserResponse
from app.core.database import get_session

router = APIRouter()

@router.post("/", response_model=UserResponse)
def signup(user_create: UserCreate, db: Session = Depends(get_session)):
    """Register a new user."""
    try:
        db_user = create_user(db=db, user_create=user_create)
        return db_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )

@router.post("/signin")
def signin(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_session)):
    """Authenticate user and return access token."""
    user = authenticate_user(db=db, email=email, password=password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_auth_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}