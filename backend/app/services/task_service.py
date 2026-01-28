from sqlmodel import Session, select, func
from sqlalchemy import or_
from typing import List, Optional
from app.models.task import Task, TaskCreate, TaskUpdate, TaskResponse, Priority
from app.models.user import User
from app.models.tag import Tag, TagResponse
from app.models.task_tag_link import TaskTagLink
from datetime import datetime

def create_task(*, db: Session, task_create: TaskCreate, owner_id: str) -> TaskResponse:
    """Create a new task for the given user."""
    task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=task_create.completed,
        owner_id=owner_id,
        priority=task_create.priority or "medium",
        due_date=task_create.due_date,
        recurrence_pattern=task_create.recurrence_pattern,
        recurrence_end_date=task_create.recurrence_end_date
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    # Handle tag associations if provided
    tags = []
    if task_create.tag_ids:
        tags = _associate_tags_with_task(db, task.id, task_create.tag_ids, owner_id)

    # Return task response
    return TaskResponse(
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
        ) for tag in tags]
    )


def _associate_tags_with_task(db: Session, task_id: str, tag_ids: List[str], owner_id: str) -> List[Tag]:
    """Associate tags with a task."""
    # Get all valid tags that belong to the user
    tags = db.exec(
        select(Tag).where(
            Tag.id.in_(tag_ids),
            Tag.owner_id == owner_id
        )
    ).all()

    # Remove existing tag associations for this task
    existing_links = db.exec(
        select(TaskTagLink).where(TaskTagLink.task_id == task_id)
    ).all()

    for link in existing_links:
        db.delete(link)

    # Create new tag associations
    for tag in tags:
        tag_link = TaskTagLink(task_id=task_id, tag_id=tag.id)
        db.add(tag_link)

    db.commit()
    return tags

def get_user_tasks(*, db: Session, owner_id: str, search: Optional[str] = None, status: Optional[str] = None, priority: Optional[str] = None, date_from: Optional[datetime] = None, date_to: Optional[datetime] = None, sort_by: Optional[str] = None, sort_order: Optional[str] = None, tag_ids: Optional[List[str]] = None) -> List[TaskResponse]:
    """Get all tasks for the given user with optional search, filters, and sorting."""
    from sqlalchemy.orm import joinedload

    query = select(Task).where(Task.owner_id == owner_id)

    # Apply tag filter if provided
    if tag_ids:
        query = query.join(TaskTagLink).where(TaskTagLink.tag_id.in_(tag_ids))

    # Apply search filter
    if search:
        query = query.where(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%")
            )
        )

    # Apply status filter
    if status:
        if status.lower() == "completed":
            query = query.where(Task.completed == True)
        elif status.lower() == "pending":
            query = query.where(Task.completed == False)

    # Apply priority filter
    if priority:
        query = query.where(Task.priority == priority.lower())

    # Apply date range filter
    if date_from:
        query = query.where(Task.created_at >= date_from)
    if date_to:
        query = query.where(Task.created_at <= date_to)

    # Apply sorting
    if sort_by:
        if sort_by == "due_date":
            sort_column = Task.due_date
        elif sort_by == "priority":
            sort_column = Task.priority
        elif sort_by == "title":
            sort_column = Task.title
        elif sort_by == "tag":
            # Special handling for tag-based sorting
            sort_column = Tag.name
            query = query.join(TaskTagLink).join(Tag).order_by(sort_column.asc() if sort_order and sort_order.lower() == "asc" else sort_column.desc())
        else:
            sort_column = Task.created_at  # Default to created_at

        if sort_by != "tag":  # Don't apply sorting again if it's tag-based
            if sort_order and sort_order.lower() == "asc":
                query = query.order_by(sort_column.asc())
            else:
                query = query.order_by(sort_column.desc())
    else:
        # Default sorting
        query = query.order_by(Task.created_at.desc())

    tasks = db.exec(query).all()

    # For each task, fetch its associated tags
    result = []
    for task in tasks:
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

def get_task_by_id(*, db: Session, task_id: str, owner_id: str) -> Optional[TaskResponse]:
    """Get a specific task by ID for the given user."""
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    ).first()

    if not task:
        return None

    # Get tags for this task
    task_tags = db.exec(
        select(Tag)
        .join(TaskTagLink)
        .where(TaskTagLink.task_id == task.id, Task.owner_id == owner_id)
    ).all()

    return TaskResponse(
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
    if task_update.priority is not None:
        task.priority = task_update.priority
    if task_update.due_date is not None:
        task.due_date = task_update.due_date
    if task_update.recurrence_pattern is not None:
        task.recurrence_pattern = task_update.recurrence_pattern
    if task_update.recurrence_end_date is not None:
        task.recurrence_end_date = task_update.recurrence_end_date

    task.updated_at = datetime.utcnow()

    db.add(task)

    # Handle tag updates if provided
    tags = []
    if task_update.tag_ids is not None:
        tags = _associate_tags_with_task(db, task_id, task_update.tag_ids, owner_id)
    else:
        # If no tag_ids provided, get existing tags for the task
        tags = db.exec(
            select(Tag)
            .join(TaskTagLink)
            .where(TaskTagLink.task_id == task.id)
        ).all()

    db.commit()
    db.refresh(task)

    return TaskResponse(
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
        ) for tag in tags]
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
    """Toggle the completion status of a task and handle recurrence if needed."""
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    ).first()

    if not task:
        return None

    # Check if the task is being marked as completed and has recurrence
    was_completed = task.completed
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    # If the task was just marked as completed and has recurrence
    if task.completed and not was_completed and task.recurrence_pattern:
        # Create a new recurring task based on the current task
        create_recurring_task(db=db, original_task=task)

    db.add(task)
    db.commit()
    db.refresh(task)

    return TaskResponse(
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
        updated_at=task.updated_at
    )


def create_recurring_task(*, db: Session, original_task: Task) -> Optional[Task]:
    """Create a new task instance based on recurrence pattern of the original task."""
    from datetime import timedelta

    # Check if recurrence end date has been reached
    if original_task.recurrence_end_date and datetime.utcnow() > original_task.recurrence_end_date:
        return None

    # Calculate next due date based on recurrence pattern
    next_due_date = calculate_next_due_date(original_task.due_date, original_task.recurrence_pattern)

    # Check if next occurrence is past the end date
    if original_task.recurrence_end_date and next_due_date and next_due_date > original_task.recurrence_end_date:
        return None

    # Create a new task with same properties but reset completion status
    new_task = Task(
        title=original_task.title,
        description=original_task.description,
        completed=False,  # New recurring task starts as not completed
        priority=original_task.priority,
        due_date=next_due_date,
        recurrence_pattern=original_task.recurrence_pattern,
        recurrence_end_date=original_task.recurrence_end_date,
        owner_id=original_task.owner_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


def calculate_next_due_date(current_due_date: Optional[datetime], recurrence_pattern: Optional[str]) -> Optional[datetime]:
    """Calculate the next due date based on the current due date and recurrence pattern."""
    if not current_due_date or not recurrence_pattern:
        return None

    if recurrence_pattern.lower() == "daily":
        return current_due_date + timedelta(days=1)
    elif recurrence_pattern.lower() == "weekly":
        return current_due_date + timedelta(weeks=1)
    elif recurrence_pattern.lower() == "monthly":
        # For monthly, add approximately 30 days (could be improved to handle months properly)
        return current_due_date + timedelta(days=30)

    return None


def mark_overdue_tasks(*, db: Session, owner_id: str):
    """Mark tasks as overdue based on due date."""
    from datetime import datetime
    current_time = datetime.utcnow()

    # Find tasks that are not completed but have a due date in the past
    overdue_tasks = db.exec(
        select(Task).where(
            Task.owner_id == owner_id,
            Task.completed == False,
            Task.due_date < current_time
        )
    ).all()

    # Update each overdue task if needed
    for task in overdue_tasks:
        # In this implementation, we just identify overdue tasks
        # In a real implementation, you might add an 'overdue' field to the Task model
        pass

    return overdue_tasks