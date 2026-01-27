# Data Model: Todo Application Backend

## Entity Definitions

### User Entity
- **Name**: User
- **Purpose**: Represents an authenticated user of the system with email identification and creation timestamp
- **Attributes**:
  - `id`: UUID (Primary Key) - Unique identifier for the user
  - `email`: String (Unique, Indexed) - User's email address for identification
  - `created_at`: DateTime - Timestamp when the user account was created
  - `updated_at`: DateTime - Timestamp when the user account was last updated

### Task Entity
- **Name**: Task
- **Purpose**: Represents a todo item owned by a user with title, optional description, completion status, and timestamps
- **Attributes**:
  - `id`: UUID (Primary Key) - Unique identifier for the task
  - `title`: String (Required) - The main title/description of the task
  - `description`: String (Optional) - Additional details about the task (nullable)
  - `completed`: Boolean (Default: False) - Whether the task is completed or pending
  - `owner_id`: UUID (Foreign Key → User.id, Indexed) - Reference to the user who owns this task
  - `created_at`: DateTime - Timestamp when the task was created
  - `updated_at`: DateTime - Timestamp when the task was last updated

## Relationships

### User → Task (One-to-Many)
- **Type**: One User can own Many Tasks
- **Constraint**: When a User is deleted, their associated Tasks should also be deleted (CASCADE)
- **Access Pattern**: Users can only access their own tasks, enforced by querying with owner_id

## Validation Rules

### User Validation
- Email must be a valid email format
- Email must be unique across all users
- Email cannot be empty or null
- Created_at and updated_at are automatically managed by the system

### Task Validation
- Title cannot be empty or null
- Title must be between 1 and 255 characters
- Description, if provided, must be less than 1000 characters
- Completed status defaults to false when creating a new task
- Owner_id must reference an existing user
- Created_at and updated_at are automatically managed by the system

## State Transitions

### Task Completion States
- **Pending** (completed = false): Task is not yet completed
- **Completed** (completed = true): Task has been completed
- **Transitions**: Pending ↔ Completed (toggle functionality)

## Indexes for Performance

### Required Indexes
- User.email: For efficient user lookup during authentication
- Task.owner_id: For efficient retrieval of user-specific tasks
- Task.created_at: For chronological sorting of tasks

## Constraints

### Data Integrity
- Foreign key constraint on Task.owner_id referencing User.id
- Not-null constraints on required fields (User.email, Task.title)
- Unique constraint on User.email to prevent duplicate accounts
- Cascade deletion from User to Task to maintain referential integrity