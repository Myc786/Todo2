from sqlmodel import Session, select
from typing import List, Optional
from app.models.task import Task, TaskCreate, TaskUpdate, TaskResponse
from app.models.user import User
from datetime import datetime

def create_task(*, db: Session, task_create: TaskCreate, owner_id: str) -> TaskResponse:
    """Create a new task for the given user."""
    task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=task_create.completed,
        owner_id=owner_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    # Return task response
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=task.owner_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

def get_user_tasks(*, db: Session, owner_id: str) -> List[TaskResponse]:
    """Get all tasks for the given user."""
    tasks = db.exec(select(Task).where(Task.owner_id == owner_id)).all()

    return [
        TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            owner_id=task.owner_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]

def get_task_by_id(*, db: Session, task_id: str, owner_id: str) -> Optional[TaskResponse]:
    """Get a specific task by ID for the given user."""
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    ).first()

    if not task:
        return None

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=task.owner_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

def update_task(*, db: Session, task_id: str, task_update: TaskUpdate, owner_id: str) -> Optional[TaskResponse]:
    """Update a specific task by ID for the given user."""
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    ).first()

    if not task:
        return None

    # Update fields if provided
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.completed is not None:
        task.completed = task_update.completed

    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=task.owner_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

def delete_task(*, db: Session, task_id: str, owner_id: str) -> bool:
    """Delete a specific task by ID for the given user."""
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    ).first()

    if not task:
        return False

    db.delete(task)
    db.commit()
    return True

def toggle_task_completion(*, db: Session, task_id: str, owner_id: str) -> Optional[TaskResponse]:
    """Toggle the completion status of a task."""
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    ).first()

    if not task:
        return None

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=task.owner_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )