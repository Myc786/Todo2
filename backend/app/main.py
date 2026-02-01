from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables before importing settings
load_dotenv()

from app.api.api_router import api_router
from app.core.config import settings
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # Validate environment variables
    try:
        if os.getenv("TESTING") != "True":
            settings.validate()
    except ValueError as e:
        print(f"Configuration error at startup: {e}")
        raise
    yield
    # Shutdown

app = FastAPI(
    title="Todo Backend API",
    description="REST API for Todo Application Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Parse allowed origins from environment variable
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Todo Backend API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Global exception handler for consistent error responses
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc):
    return {"detail": exc.detail, "status_code": exc.status_code}