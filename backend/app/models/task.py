from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date
from typing import Optional, TYPE_CHECKING, List, Union, Any
from enum import Enum
import uuid
from pydantic import field_validator

if TYPE_CHECKING:
    from .tag import Tag, TagResponse
    from .task_tag_link import TaskTagLink

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    owner_id: str = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Enhanced features
    priority: Priority = Field(default=Priority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    recurrence_pattern: Optional[str] = Field(default=None)  # daily, weekly, monthly
    recurrence_end_date: Optional[datetime] = Field(default=None)

class TaskCreate(TaskBase):
    priority: Optional[Priority] = None
    due_date: Optional[Union[datetime, date]] = None
    recurrence_pattern: Optional[str] = None
    recurrence_end_date: Optional[Union[datetime, date]] = None
    tag_ids: Optional[List[str]] = []  # IDs of tags to associate with the task

    @field_validator('due_date', 'recurrence_end_date')
    @classmethod
    def parse_datetime_or_date(cls, v: Any) -> Optional[datetime]:
        if v is None:
            return None

        if isinstance(v, datetime):
            return v
        elif isinstance(v, date):
            # Convert date to datetime at start of day
            return datetime.combine(v, datetime.min.time())

        # Try to parse as datetime string first
        if isinstance(v, str):
            # Handle ISO format datetime strings
            if 'T' in v or 't' in v or '_' in v or ' ' in v:
                try:
                    return datetime.fromisoformat(v.replace('Z', '+00:00'))
                except ValueError:
                    pass

            # Try to parse as date string and convert to datetime at start of day
            try:
                parsed_date = date.fromisoformat(v)
                return datetime.combine(parsed_date, datetime.min.time())
            except ValueError:
                pass

        raise ValueError(f"Unable to parse datetime or date from: {v}")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Milk, bread, eggs",
                "completed": False,
                "priority": "medium",
                "due_date": "2023-12-31T10:00:00Z",
                "recurrence_pattern": "weekly",
                "recurrence_end_date": "2024-12-31T10:00:00Z",
                "tag_ids": []
            }
        }

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)
    priority: Optional[Priority] = None
    due_date: Optional[Union[datetime, date]] = None
    recurrence_pattern: Optional[str] = None
    recurrence_end_date: Optional[Union[datetime, date]] = None
    tag_ids: Optional[List[str]] = None  # IDs of tags to associate with the task

    @field_validator('due_date', 'recurrence_end_date')
    @classmethod
    def parse_datetime_or_date(cls, v: Any) -> Optional[datetime]:
        if v is None:
            return None

        if isinstance(v, datetime):
            return v
        elif isinstance(v, date):
            # Convert date to datetime at start of day
            return datetime.combine(v, datetime.min.time())

        # Try to parse as datetime string first
        if isinstance(v, str):
            # Handle ISO format datetime strings
            if 'T' in v or 't' in v or '_' in v or ' ' in v:
                try:
                    return datetime.fromisoformat(v.replace('Z', '+00:00'))
                except ValueError:
                    pass

            # Try to parse as date string and convert to datetime at start of day
            try:
                parsed_date = date.fromisoformat(v)
                return datetime.combine(parsed_date, datetime.min.time())
            except ValueError:
                pass

        raise ValueError(f"Unable to parse datetime or date from: {v}")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy Groceries",
                "description": "Milk, bread, eggs",
                "completed": True,
                "priority": "high",
                "due_date": "2023-12-31T10:00:00Z",
                "recurrence_pattern": "daily",
                "recurrence_end_date": "2024-12-31T10:00:00Z",
                "tag_ids": []
            }
        }

class TaskResponse(TaskBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
    priority: Priority
    due_date: Optional[datetime] = None
    recurrence_pattern: Optional[str] = None
    recurrence_end_date: Optional[datetime] = None
    tags: Optional[List[dict]] = []  # Associated tags - using dict to avoid circular import

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "Buy groceries",
                "description": "Milk, bread, eggs",
                "completed": False,
                "priority": "medium",
                "due_date": "2023-12-31T10:00:00Z",
                "recurrence_pattern": "weekly",
                "recurrence_end_date": "2024-12-31T10:00:00Z",
                "owner_id": "123e4567-e89b-12d3-a456-426614174001",
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T00:00:00Z",
                "tags": []
            }
        }