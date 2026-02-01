# Todo Application - Frontend and Backend Integration

This project consists of a full-stack Todo application with a Next.js frontend deployed on Vercel and a FastAPI backend deployed on Hugging Face Spaces.

## Architecture

- **Frontend**: Next.js 14 application with TypeScript, Tailwind CSS, and Radix UI
- **Backend**: FastAPI application with SQLModel ORM and PostgreSQL database
- **Authentication**: JWT-based authentication system
- **Deployment**: Frontend on Vercel, Backend on Hugging Face Spaces

## Features

- User authentication (register/login)
- Task management (create, read, update, delete, toggle completion)
- Task filtering and search
- Tagging system for tasks
- Responsive UI design

## Production Deployment

### Backend Deployment (Hugging Face Spaces)

1. Deploy the backend to Hugging Face Spaces using the Docker option
2. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL database connection string
   - `BETTER_AUTH_SECRET`: JWT secret (at least 32 characters)
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., "https://your-frontend.vercel.app,http://localhost:3000")

### Frontend Deployment (Vercel)

1. Deploy the frontend to Vercel with root directory set to `frontend`
2. Configure environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your backend URL (e.g., `https://myc786-todo2.hf.space`)
   - Note: Do not include `/api/v1` in this URL as the API client handles this automatically

## API Client Configuration

The frontend API client (`frontend/lib/api.ts`) has been configured to:
- Use the `NEXT_PUBLIC_API_BASE_URL` environment variable
- Automatically append `/api/v1` to all API requests
- Handle authentication tokens properly
- Provide consistent error handling

## Security Features

- CORS is restricted to specific origins (not wildcard)
- JWT tokens for authentication
- Secure password hashing
- Input validation on both frontend and backend

## Documentation

- `DEPLOYMENT.md`: Detailed deployment instructions
- `BACKEND_VERIFICATION.md`: Backend verification guide
- `TEST_CONNECTION_GUIDE.md`: Connection testing guide
- `UPDATE_ENV_VARIABLES.md`: Environment variables setup
- `UPDATE_VERCEL_ENV_VARIABLES_GUIDE.md`: Vercel-specific environment setup
- `VERCEL_DEPLOYMENT_SUMMARY.md`: Deployment summary

## Development

To run locally:
1. Start the backend: `cd backend && uvicorn app.main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Set environment variables as needed

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: FastAPI, SQLModel, PostgreSQL, Pydantic
- **Authentication**: JWT, Passlib
- **Deployment**: Vercel, Hugging Face Spaces
