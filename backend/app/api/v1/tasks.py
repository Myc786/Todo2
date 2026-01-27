from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from app.services.task_service import (
    create_task, get_user_tasks, get_task_by_id,
    update_task, delete_task, toggle_task_completion
)
from app.models.task import TaskCreate, TaskUpdate, TaskResponse
from app.models.user import User
from app.core.database import get_session
from app.core.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=TaskResponse)
def create_new_task(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Create a new task for the authenticated user."""
    return create_task(db=db, task_create=task_create, owner_id=current_user.id)

@router.get("/", response_model=List[TaskResponse])
def read_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get all tasks for the authenticated user."""
    return get_user_tasks(db=db, owner_id=current_user.id)

@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get a specific task by ID for the authenticated user."""
    task = get_task_by_id(db=db, task_id=task_id, owner_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_existing_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update a specific task by ID for the authenticated user."""
    updated_task = update_task(
        db=db,
        task_id=task_id,
        task_update=task_update,
        owner_id=current_user.id
    )
    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return updated_task

@router.delete("/{task_id}")
def delete_existing_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete a specific task by ID for the authenticated user."""
    success = delete_task(db=db, task_id=task_id, owner_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return {"message": "Task deleted successfully"}

@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_complete(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Toggle the completion status of a task for the authenticated user."""
    updated_task = toggle_task_completion(
        db=db,
        task_id=task_id,
        owner_id=current_user.id
    )
    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return updated_task