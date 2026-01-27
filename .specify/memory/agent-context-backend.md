# Agent Context for Todo Backend Development

## Technologies Used

- **Framework**: FastAPI (Python)
- **ORM**: SQLModel
- **Database**: Neon PostgreSQL
- **Authentication**: Better Auth
- **API Style**: RESTful with JWT tokens
- **Environment Management**: python-dotenv

## Key Architecture Patterns

- Dependency injection using FastAPI
- Clean architecture with separation of models, schemas, services, and API layers
- JWT-based authentication with middleware protection
- User data isolation through owner_id foreign key enforcement

## Critical Security Points

- All endpoints require authentication except auth endpoints
- User data is isolated by owner_id
- Passwords are hashed (to be implemented)
- JWT tokens are validated on protected routes
- Input validation is enforced via Pydantic schemas

## File Structure

- Models in `app/models/`
- Schemas in `app/schemas/`
- API routes in `app/api/v1/`
- Business logic in `app/services/`
- Configuration in `app/core/`