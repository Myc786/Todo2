---
id: 3
title: todo-backend-task-generation
stage: tasks
date_iso: 2026-01-25
surface: agent
model: Claude Sonnet 4.5
feature: todo-backend
branch: 1-todo-backend
user: user
command: /sp.tasks
labels: ["tasks", "backend", "todo-app", "implementation"]
links:
  spec: "specs/1-todo-backend/spec.md"
  plan: "specs/1-todo-backend/plan.md"
  tasks: "specs/1-todo-backend/tasks.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/1-todo-backend/tasks.md"
tests_yaml: []
---

# Prompt

```
/sp.tasks

Project: Phase II – Todo Application Backend

Purpose:
Break the backend implementation into atomic, ordered tasks that Claude Code can execute reliably, ensuring correctness, security, and seamless frontend integration.

==================================================
TASK GROUP 1: BACKEND INITIALIZATION
==================================================

Task 1.1 – Create Backend Folder
- Create `/backend` directory at project root
- Ensure no backend files exist outside this folder

Task 1.2 – Initialize Python Environment
- Create `requirements.txt`
- Add FastAPI, Uvicorn, SQLModel, Psycopg, python-dotenv, jose/jwt dependencies

Task 1.3 – Project Skeleton
- Create base folder structure:
  - backend/app
  - backend/app/api
  - backend/app/models
  - backend/app/schemas
  - backend/app/services
  - backend/app/auth
  - backend/app/core

==================================================
TASK GROUP 2: APPLICATION BOOTSTRAP
==================================================

Task 2.1 – FastAPI Entry Point
- Create `backend/app/main.py`
- Initialize FastAPI app instance
- Add root health check endpoint

Task 2.2 – Environment Loader
- Implement env loading using python-dotenv
- Validate required variables at startup
- Abort startup if missing variables

==================================================
TASK GROUP 3: DATABASE SETUP (NEON)
==================================================

Task 3.1 – Database Engine
- Create `backend/app/core/database.py`
- Configure SQLModel engine using DATABASE_URL
- Enable connection pooling

Task 3.2 – Database Session Dependency
- Implement session dependency injection
- Ensure sessions are closed correctly

Task 3.3 – Database Initialization
- Auto-create tables on app startup
- Verify Neon connectivity

==================================================
TASK GROUP 4: DATA MODELS
==================================================

Task 4.1 – User Model
- Create SQLModel User
- Fields: id, email, created_at

Task 4.2 – Task Model
- Create SQLModel Task
- Fields:
  - id
  - title
  - description
  - completed
  - owner_id
  - created_at
  - updated_at

Task 4.3 – Model Relationships
- Link Task.owner_id → User.id
- Enforce ownership constraints

==================================================
TASK GROUP 5: AUTHENTICATION (BETTER AUTH)
==================================================

Task 5.1 – Auth Configuration
- Create auth configuration module
- Load BETTER_AUTH_SECRET and BETTER_AUTH_URL

Task 5.2 – Token Verification
- Implement JWT validation logic
- Decode and verify tokens securely

Task 5.3 – Auth Dependency
- Create reusable `get_current_user` dependency
- Raise 401 on invalid or missing token

==================================================
TASK GROUP 6: SCHEMAS (Pydantic)
==================================================

Task 6.1 – Task Create Schema
- title (required)
- description (optional)

Task 6.2 – Task Update Schema
- title (optional)
- description (optional)
- completed (optional)

Task 6.3 – Task Response Schema
- Include id, title, completed, timestamps

==================================================
TASK GROUP 7: BUSINESS LOGIC (SERVICES)
==================================================

Task 7.1 – Task Service
- Implement create_task
- Implement get_user_tasks
- Implement get_task_by_id
- Implement update_task
- Implement delete_task
- Implement toggle_task_completion

==================================================
TASK GROUP 8: API ROUTES
==================================================

Task 8.1 – Task Router
- Create `/api/tasks` router
- Protect all routes with auth dependency

Task 8.2 – CRUD Endpoints
- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/{id}
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}
- PATCH /api/tasks/{id}/complete

Task 8.3 – Ownership Enforcement
- Ensure users can only access their own tasks

==================================================
TASK GROUP 9: FRONTEND INTEGRATION
==================================================

Task 9.1 – CORS Setup
- Allow frontend origin
- Allow Authorization header

Task 9.2 – Response Consistency
- Standardize JSON responses
- Normalize error messages

==================================================
TASK GROUP 10: ERROR HANDLING
==================================================

Task 10.1 – Global Exception Handler
- Handle validation errors
- Handle authentication errors
- Hide internal stack traces

==================================================
TASK GROUP 11: DOCUMENTATION & VERIFICATION
==================================================

Task 11.1 – OpenAPI Review
- Verify endpoint documentation
- Validate request/response models

Task 11.2 – Integration Verification
- Test backend independently
- Verify frontend compatibility

==================================================
DEFINITION OF DONE
==================================================

Backend tasks are complete when:
- All tasks executed without errors
- Authentication fully functional
- Neon DB stores and retrieves tasks
- Frontend can consume all APIs
```

# Response

Generated comprehensive task breakdown for the Todo Application Backend implementation with 36 specific tasks organized into 6 phases:

## Task Distribution
- **Phase 1 (Setup)**: 5 tasks for project initialization
- **Phase 2 (Foundation)**: 7 tasks for core infrastructure
- **Phase 3 (User Story 1 - Auth)**: 6 tasks for authentication functionality
- **Phase 4 (User Story 2 - Task CRUD)**: 5 tasks for core task management
- **Phase 5 (User Story 3 - Completion)**: 4 tasks for task completion features
- **Phase 6 (Polish)**: 8 tasks for final integration and validation

## Key Features
- All tasks follow the required checklist format with proper IDs, labels, and file paths
- 18 tasks marked as parallelizable ([P]) for efficient execution
- User stories organized by priority (P1, P2) from the original specification
- Dependencies clearly defined between phases
- Independent test criteria specified for each user story
- Success criteria aligned with original requirements

## Architecture Alignment
- Implements the planned directory structure with proper separation of concerns
- Follows FastAPI best practices with models, schemas, services, and API layers
- Enforces security with JWT authentication and user data isolation
- Uses SQLModel ORM with proper relationships and constraints

The tasks are ready for implementation and will deliver a complete, production-ready backend following the specified architecture and requirements.