from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

# Import here for the relationship
from .task_tag_link import TaskTagLink

if TYPE_CHECKING:
    from .task import Task

class TagBase(SQLModel):
    name: str = Field(min_length=1, max_length=50)


class Tag(TagBase, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    owner_id: str = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)



class TagCreate(TagBase):
    pass

    class Config:
        json_schema_extra = {
            "example": {
                "name": "work"
            }
        }


class TagUpdate(SQLModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=50)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "personal"
            }
        }


class TagResponse(TagBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "work",
                "owner_id": "123e4567-e89b-12d3-a456-426614174001",
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T00:00:00Z"
            }
        }