# Todo Backend API

This is the backend API for the Todo Application, built with FastAPI and SQLModel.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy the environment file and update the values:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Start the development server:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Features

- User authentication (signup/login)
- Task management (CRUD operations)
- JWT-based authentication
- Neon PostgreSQL database integration
- RESTful API design