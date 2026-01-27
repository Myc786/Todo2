---
id: 001
title: Generate Refactor Tasks
stage: tasks
date: 2026-01-25
surface: agent
model: Claude Sonnet 4.5
feature: todo-frontend-refactor
branch: master
user: user
command: /sp.tasks
labels: [tasks, refactor, frontend, todo-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/todo-frontend-refactor/tasks.md
tests:
  - specs/todo-frontend-refactor/tasks.md
---

## Prompt

Project: Phase II – Todo Application (Frontend Refactor)

Goal:
Move all frontend-related files from the project root into a dedicated `frontend/` folder while preserving application behavior and preventing any import/export or build errors.

--------------------------------------------------
TASK GROUP 1: FRONTEND FOLDER CREATION
--------------------------------------------------

Task 1.1
Create a new top-level folder named:
- /frontend

Rules:
- Do not delete any existing files yet
- No renaming during this task

--------------------------------------------------
TASK GROUP 2: FILE IDENTIFICATION
--------------------------------------------------

Task 2.1
Identify all frontend-related files currently located in the project root, including:
- /app
- /components
- /lib (frontend-only utilities)
- tailwind.config.*
- postcss.config.*
- next.config.*
- public/

Task 2.2
Explicitly list files that must NOT be moved, such as:
- Backend code
- Database configuration
- Environment files used by backend only

--------------------------------------------------
TASK GROUP 3: FILE MIGRATION
--------------------------------------------------

Task 3.1
Move the following directories into /frontend:
- /app        → /frontend/app
- /components → /frontend/components
- /lib        → /frontend/lib
- /public     → /frontend/public

Task 3.2
Move frontend configuration files into /frontend:
- next.config.*
- tailwind.config.*
- postcss.config.*

Rules:
- Preserve file contents
- Do not modify code yet

--------------------------------------------------
TASK GROUP 4: PATH & CONFIGURATION UPDATES
--------------------------------------------------

Task 4.1
Update Next.js configuration
- Ensure Next.js recognizes `/frontend` as the application root
- Validate app directory resolution

Task 4.2
Update Tailwind configuration
- Fix content paths to point to `/frontend/app` and `/frontend/components`

Task 4.3
Update absolute imports (if used)
- Ensure aliases resolve correctly from `/frontend`

--------------------------------------------------
TASK GROUP 5: IMPORT / EXPORT VALIDATION
--------------------------------------------------

Task 5.1
Scan all frontend files for broken imports
- Fix relative paths
- Ensure all default exports remain unchanged

Task 5.2
Check barrel files (index.ts)
- Confirm correct re-exports
- Remove unused exports

--------------------------------------------------
TASK GROUP 6: BUILD & RUNTIME VERIFICATION
--------------------------------------------------

Task 6.1
Run development build
- Fix any module resolution errors
- Resolve missing asset issues

Task 6.2
Run production build
- Ensure zero warnings or errors

--------------------------------------------------
TASK GROUP 7: CLEANUP
--------------------------------------------------

Task 7.1
Remove old frontend files from project root
- Only after successful build

Task 7.2
Final verification
- App renders correctly
- Navigation works
- Styling intact

--------------------------------------------------
SUCCESS CRITERIA

## Response snapshot

I've successfully created the tasks file for the frontend refactor project. The tasks.md file includes 27 specific, actionable tasks organized across 7 phases:

1. Frontend Folder Creation (T001)
2. File Identification (T002-T003)
3. File Migration (T004-T009)
4. Path & Configuration Updates (T010-T012)
5. Import / Export Validation (T013-T017)
6. Build & Runtime Verification (T018-T022)
7. Cleanup & Final Verification (T023-T027)

Each task follows the required format: `- [ ] T### [Labels] Description with file path`. The tasks are organized to enable safe, incremental refactoring with proper validation at each step.

## Outcome

- ✅ Impact: Created comprehensive task list for frontend refactor
- 🧪 Tests: tasks.md file validated for proper format and structure
- 📁 Files: specs/todo-frontend-refactor/tasks.md created successfully
- 🔁 Next prompts: Ready for implementation phase
- 🧠 Reflection: Tasks are well-structured and follow the required format

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation of Phase 1 tasks