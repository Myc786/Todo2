# Backend Verification Guide

This document provides steps to verify that the backend API is properly deployed and accessible.

## Pre-deployment Checklist

Before deploying the backend, ensure the following:

- [ ] Database URL is configured
- [ ] Authentication secret is set
- [ ] Environment variables are properly configured

## API Endpoints Verification

Once deployed, verify the following endpoints are accessible:

1. **Health Check**: `GET /health`
   - Expected Response: `{"status": "healthy"}`

2. **API Root**: `GET /`
   - Expected Response: `{"message": "Todo Backend API is running!"}`

3. **Authentication**:
   - `POST /api/v1/auth/` (registration)
   - `POST /api/v1/auth/signin` (login)

4. **Tasks API**:
   - `GET /api/v1/tasks/` (requires authentication)
   - `POST /api/v1/tasks/` (requires authentication)
   - `PUT /api/v1/tasks/{id}` (requires authentication)
   - `DELETE /api/v1/tasks/{id}` (requires authentication)

5. **Tags API**:
   - `GET /api/v1/tags/` (requires authentication)
   - `POST /api/v1/tags/` (requires authentication)

## Testing Script

Use the following script to verify the backend is working:

```bash
# Test health endpoint
curl -X GET https://myc786-todo2.hf.space/health

# Test API root
curl -X GET https://myc786-todo2.hf.space/

# Test API endpoints (will require authentication)
curl -X GET https://myc786-todo2.hf.space/api/v1/tasks/   -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## CORS Configuration

The backend is configured with specific allowed origins for security:

- Local development: `http://localhost:3000`, `http://localhost:3001`
- Production origins can be added via the `ALLOWED_ORIGINS` environment variable

When deploying to production, update the `ALLOWED_ORIGINS` environment variable to include your frontend domain.

## Troubleshooting

- If API calls return CORS errors, check that your origin is included in `ALLOWED_ORIGINS`
- If authentication fails, verify JWT tokens are being passed correctly
- If database connections fail, check that the `DATABASE_URL` environment variable is properly set
