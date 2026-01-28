from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
from app.models.task import Task
from app.services.task_service import (
    create_task, get_user_tasks, get_task_by_id,
    update_task, delete_task, toggle_task_completion
)
from app.models.task import TaskCreate, TaskUpdate, TaskResponse, Priority
from app.models.user import User
from app.models.tag import Tag, TagResponse
from app.models.task_tag_link import TaskTagLink
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
    search: Optional[str] = Query(None, description="Keyword search in title or description"),
    status: Optional[str] = Query(None, description="Filter by status: completed or pending"),
    priority: Optional[str] = Query(None, description="Filter by priority: low, medium, or high"),
    date_from: Optional[datetime] = Query(None, description="Filter by creation date from"),
    date_to: Optional[datetime] = Query(None, description="Filter by creation date to"),
    sort_by: Optional[str] = Query(None, description="Sort by: due_date, priority, title, or created_at (default)"),
    sort_order: Optional[str] = Query(None, description="Sort order: asc or desc (default)"),
    tag_ids: Optional[List[str]] = Query(None, description="Filter by tag IDs"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get all tasks for the authenticated user with optional search, filters, and sorting."""
    return get_user_tasks(
        db=db,
        owner_id=current_user.id,
        search=search,
        status=status,
        priority=priority,
        date_from=date_from,
        date_to=date_to,
        sort_by=sort_by,
        sort_order=sort_order,
        tag_ids=tag_ids
    )

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


@router.get("/upcoming/{hours}", response_model=List[TaskResponse])
def get_upcoming_tasks(
    hours: int = 24,  # Default to 24 hours
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get tasks that are due within the specified number of hours."""
    from datetime import datetime, timedelta

    future_time = datetime.utcnow() + timedelta(hours=hours)

    # Get tasks that are not completed and are due within the specified timeframe
    query = select(Task).where(
        Task.owner_id == current_user.id,
        Task.completed == False,
        Task.due_date.is_not(None),
        Task.due_date <= future_time
    ).order_by(Task.due_date.asc())

    upcoming_tasks = db.exec(query).all()

    # For each task, fetch its associated tags
    result = []
    for task in upcoming_tasks:
        # Get tags for this task
        task_tags = db.exec(
            select(Tag)
            .join(TaskTagLink)
            .where(TaskTagLink.task_id == task.id)
        ).all()

        result.append(
            TaskResponse(
                id=task.id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                priority=task.priority,
                due_date=task.due_date,
                recurrence_pattern=task.recurrence_pattern,
                recurrence_end_date=task.recurrence_end_date,
                owner_id=task.owner_id,
                created_at=task.created_at,
                updated_at=task.updated_at,
                tags=[TagResponse(
                    id=tag.id,
                    name=tag.name,
                    owner_id=tag.owner_id,
                    created_at=tag.created_at,
                    updated_at=tag.updated_at
                ) for tag in task_tags]
            )
        )

    return result

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