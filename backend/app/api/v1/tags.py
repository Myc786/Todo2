from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from app.services.tag_service import (
    create_tag, get_user_tags, get_tag_by_id,
    update_tag, delete_tag
)
from app.models.tag import TagCreate, TagUpdate, TagResponse
from app.models.user import User
from app.core.database import get_session
from app.core.deps import get_current_user

router = APIRouter()


@router.post("/", response_model=TagResponse)
def create_new_tag(
    tag_create: TagCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Create a new tag for the authenticated user."""
    return create_tag(db=db, tag_create=tag_create, owner_id=current_user.id)


@router.get("/", response_model=List[TagResponse])
def read_tags(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get all tags for the authenticated user."""
    return get_user_tags(db=db, owner_id=current_user.id)


@router.get("/{tag_id}", response_model=TagResponse)
def read_tag(
    tag_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get a specific tag by ID for the authenticated user."""
    tag = get_tag_by_id(db=db, tag_id=tag_id, owner_id=current_user.id)
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    return tag


@router.put("/{tag_id}", response_model=TagResponse)
def update_existing_tag(
    tag_id: str,
    tag_update: TagUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update a specific tag by ID for the authenticated user."""
    updated_tag = update_tag(
        db=db,
        tag_id=tag_id,
        tag_update=tag_update,
        owner_id=current_user.id
    )
    if not updated_tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    return updated_tag


@router.delete("/{tag_id}")
def delete_existing_tag(
    tag_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete a specific tag by ID for the authenticated user."""
    success = delete_tag(db=db, tag_id=tag_id, owner_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    return {"message": "Tag deleted successfully"}