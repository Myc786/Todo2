# Backend Quickstart Guide: Todo Application

## Prerequisites

- Python 3.11+
- pip package manager
- Neon PostgreSQL account with connection URL
- Better Auth account for authentication secrets

## Setup Instructions

### 1. Clone and Navigate
```bash
# Navigate to the project root
cd /path/to/project
```

### 2. Create Backend Directory Structure
```bash
mkdir -p backend/{app,app/core,app/models,app/schemas,app/api,app/api/v1,app/services,app/utils}
```

### 3. Install Dependencies
```bash
# Create requirements.txt
cat > backend/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlmodel==0.0.16
pydantic==2.5.0
pydantic-settings==2.1.0
better-exceptions==0.3.2
python-multipart==0.0.6
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9
asyncpg==0.29.0
httpx==0.25.2
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
flake8==6.1.0
EOF

# Install dependencies
pip install -r backend/requirements.txt
```

### 4. Create Environment Configuration
```bash
# Create .env file
cat > backend/.env.example << 'EOF'
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-super-secret-auth-key-here
BETTER_AUTH_URL=http://localhost:8000
DEBUG=true
EOF

# Copy to .env and update with your values
cp backend/.env.example backend/.env
# Edit backend/.env with your actual values
```

### 5. Initialize Application Files

#### Main Application Entry Point
```bash
cat > backend/app/main.py << 'EOF'
from contextlib import asynccontextmanager
from fastapi import FastAPI
import os
from dotenv import load_dotenv

from app.core.database import engine
from app.api.api_router import api_router
from app.core.config import settings

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown

app = FastAPI(
    title="Todo Backend API",
    description="REST API for Todo Application Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Todo Backend API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
EOF
```

#### Configuration Settings
```bash
cat > backend/app/core/config.py << 'EOF'
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "")
    BETTER_AUTH_URL: str = os.getenv("BETTER_AUTH_URL", "http://localhost:8000")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Validate required settings
    def validate(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable is required")
        if not self.BETTER_AUTH_SECRET:
            raise ValueError("BETTER_AUTH_SECRET environment variable is required")

settings = Settings()
settings.validate()
EOF
```

#### Database Setup
```bash
cat > backend/app/core/database.py << 'EOF'
from sqlmodel import create_engine, Session
from app.core.config import settings
import os

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

def get_session():
    with Session(engine) as session:
        yield session
EOF
```

### 6. Start the Development Server
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. API Endpoints Overview
Once running, the following endpoints will be available:
- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `GET /api/v1/tasks/` - Get user's tasks
- `POST /api/v1/tasks/` - Create new task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

### 8. Access API Documentation
After starting the server, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Next Steps

1. Implement the User and Task models in `app/models/`
2. Create Pydantic schemas in `app/schemas/`
3. Build API endpoints in `app/api/v1/`
4. Implement business logic in `app/services/`
5. Add authentication middleware