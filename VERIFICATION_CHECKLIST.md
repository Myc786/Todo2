# Production Deployment Verification Script

This script verifies that the deployed application works correctly with the new configuration.

## Frontend Configuration Check

### 1. API Client Setup
- [ ] `NEXT_PUBLIC_API_BASE_URL` is set to `https://myc786-todo2.hf.space`
- [ ] API client uses the `getApiUrl()` function for all endpoints
- [ ] `/api/v1` is automatically appended to the base URL
- [ ] Authorization headers are properly attached to authenticated requests

### 2. Environment Variables
- [ ] `NEXT_PUBLIC_API_BASE_URL` is configured in Vercel
- [ ] Value does not include `/api/v1` suffix (handled by API client)

## Backend Configuration Check

### 1. CORS Settings
- [ ] `ALLOWED_ORIGINS` environment variable is set with Vercel domain
- [ ] Example: `https://your-todo-app.vercel.app,http://localhost:3000`
- [ ] Only specified origins are allowed (not wildcard)

### 2. Security Settings
- [ ] `BETTER_AUTH_SECRET` is configured
- [ ] `DATABASE_URL` is configured
- [ ] JWT tokens are properly validated

## Integration Testing

### 1. Authentication Flow
- [ ] User can register via frontend
- [ ] Registration request goes to `POST https://myc786-todo2.hf.space/api/v1/auth/`
- [ ] User can login via frontend
- [ ] Login request goes to `POST https://myc786-todo2.hf.space/api/v1/auth/signin`
- [ ] JWT token is received and stored
- [ ] Subsequent API calls include `Authorization: Bearer <token>`

### 2. Task Operations
- [ ] Fetch all tasks: `GET https://myc786-todo2.hf.space/api/v1/tasks/`
- [ ] Create task: `POST https://myc786-todo2.hf.space/api/v1/tasks/`
- [ ] Update task: `PUT https://myc786-todo2.hf.space/api/v1/tasks/{id}`
- [ ] Delete task: `DELETE https://myc786-todo2.hf.space/api/v1/tasks/{id}`
- [ ] Toggle completion: `PATCH https://myc786-todo2.hf.space/api/v1/tasks/{id}/complete`

### 3. Tag Operations
- [ ] Fetch all tags: `GET https://myc786-todo2.hf.space/api/v1/tags/`
- [ ] Create tag: `POST https://myc786-todo2.hf.space/api/v1/tags/`
- [ ] Update tag: `PUT https://myc786-todo2.hf.space/api/v1/tags/{id}`
- [ ] Delete tag: `DELETE https://myc786-todo2.hf.space/api/v1/tags/{id}`

## Error Handling

### 1. Authentication Errors
- [ ] 401 Unauthorized responses are handled gracefully
- [ ] User is redirected to login when token expires
- [ ] Appropriate error messages are shown

### 2. Network Errors
- [ ] Connection failures are handled gracefully
- [ ] User-friendly error messages are displayed
- [ ] Retry mechanisms work if implemented

## Security Verification

### 1. CORS Compliance
- [ ] Only allowed origins can access the API
- [ ] Cross-origin requests from unauthorized domains are blocked
- [ ] No CORS errors in browser console

### 2. Authentication Validation
- [ ] Backend validates JWT tokens properly
- [ ] User IDs come from validated tokens, not client input
- [ ] Users can only access their own data

## Performance Check

### 1. API Response Times
- [ ] API calls respond within acceptable time limits
- [ ] No timeout errors during normal operation

### 2. Resource Usage
- [ ] Memory usage is stable
- [ ] No memory leaks in long-running sessions

## Deployment Verification

### 1. Frontend Deployment
- [ ] Application loads correctly on Vercel domain
- [ ] All assets load without errors
- [ ] Environment variables are properly applied

### 2. Backend Deployment
- [ ] API endpoints are accessible
- [ ] Health check passes: `GET https://myc786-todo2.hf.space/health`
- [ ] Database connections are established
- [ ] All environment variables are loaded correctly

## Final Checklist

- [ ] All API endpoints respond correctly
- [ ] Authentication works end-to-end
- [ ] All task operations function properly
- [ ] Tags system works correctly
- [ ] Error handling is robust
- [ ] Security measures are effective
- [ ] CORS is properly configured
- [ ] Frontend and backend communicate seamlessly
- [ ] Production best practices are followed