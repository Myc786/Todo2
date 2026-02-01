# Updated Backend Configuration for CORS

## app/core/config.py
```python
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "")
    BETTER_AUTH_URL: str = os.getenv("BETTER_AUTH_URL", "http://localhost:8000")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    # Updated default to include common frontend domains
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "https://frontend-mocha-beta-73.vercel.app,https://frontend-pc6dr97gs-myc786s-projects.vercel.app,http://localhost:3000,http://localhost:3001")

    # Validate required settings
    def validate(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable is required")
        if not self.BETTER_AUTH_SECRET:
            raise ValueError("BETTER_AUTH_SECRET environment variable is required")

settings = Settings()
```

## app/main.py (verification)
```python
# This should already be correct in your code
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
```

## Required Environment Variable Value:
```
ALLOWED_ORIGINS=https://frontend-mocha-beta-73.vercel.app,https://frontend-pc6dr97gs-myc786s-projects.vercel.app,http://localhost:3000,http://localhost:3001
```