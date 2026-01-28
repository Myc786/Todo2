from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
import uuid

class TaskTagLink(SQLModel, table=True):
    """
    Junction table for many-to-many relationship between tasks and tags.
    """
    task_id: str = Field(foreign_key="task.id", primary_key=True)
    tag_id: str = Field(foreign_key="tag.id", primary_key=True)