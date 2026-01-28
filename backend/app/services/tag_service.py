from sqlmodel import Session, select
from typing import List, Optional
from app.models.tag import Tag, TagCreate, TagUpdate, TagResponse
from app.models.user import User
from datetime import datetime

def create_tag(*, db: Session, tag_create: TagCreate, owner_id: str) -> TagResponse:
    """Create a new tag for the given user."""
    # Check if tag with this name already exists for this user
    existing_tag = db.exec(
        select(Tag).where(Tag.name == tag_create.name, Tag.owner_id == owner_id)
    ).first()

    if existing_tag:
        # Return existing tag if it already exists for this user
        return TagResponse(
            id=existing_tag.id,
            name=existing_tag.name,
            owner_id=existing_tag.owner_id,
            created_at=existing_tag.created_at,
            updated_at=existing_tag.updated_at
        )

    tag = Tag(
        name=tag_create.name,
        owner_id=owner_id
    )

    db.add(tag)
    db.commit()
    db.refresh(tag)

    # Return tag response
    return TagResponse(
        id=tag.id,
        name=tag.name,
        owner_id=tag.owner_id,
        created_at=tag.created_at,
        updated_at=tag.updated_at
    )


def get_user_tags(*, db: Session, owner_id: str) -> List[TagResponse]:
    """Get all tags for the given user."""
    tags = db.exec(select(Tag).where(Tag.owner_id == owner_id)).all()

    return [
        TagResponse(
            id=tag.id,
            name=tag.name,
            owner_id=tag.owner_id,
            created_at=tag.created_at,
            updated_at=tag.updated_at
        )
        for tag in tags
    ]


def get_tag_by_id(*, db: Session, tag_id: str, owner_id: str) -> Optional[TagResponse]:
    """Get a specific tag by ID for the given user."""
    tag = db.exec(
        select(Tag).where(Tag.id == tag_id, Tag.owner_id == owner_id)
    ).first()

    if not tag:
        return None

    return TagResponse(
        id=tag.id,
        name=tag.name,
        owner_id=tag.owner_id,
        created_at=tag.created_at,
        updated_at=tag.updated_at
    )


def update_tag(*, db: Session, tag_id: str, tag_update: TagUpdate, owner_id: str) -> Optional[TagResponse]:
    """Update a specific tag by ID for the given user."""
    tag = db.exec(
        select(Tag).where(Tag.id == tag_id, Tag.owner_id == owner_id)
    ).first()

    if not tag:
        return None

    # Update fields if provided
    if tag_update.name is not None:
        tag.name = tag_update.name

    tag.updated_at = datetime.utcnow()

    db.add(tag)
    db.commit()
    db.refresh(tag)

    return TagResponse(
        id=tag.id,
        name=tag.name,
        owner_id=tag.owner_id,
        created_at=tag.created_at,
        updated_at=tag.updated_at
    )


def delete_tag(*, db: Session, tag_id: str, owner_id: str) -> bool:
    """Delete a specific tag by ID for the given user."""
    tag = db.exec(
        select(Tag).where(Tag.id == tag_id, Tag.owner_id == owner_id)
    ).first()

    if not tag:
        return False

    db.delete(tag)
    db.commit()
    return True