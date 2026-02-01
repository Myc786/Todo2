# Test Connection Guide

This document provides steps to test the connection between the frontend and backend after deployment.

## Pre-requisites

- Backend must be deployed and accessible
- Frontend must be deployed with correct environment variables
- Both services must be running and healthy

## Testing Steps

### 1. Backend Health Check

First, verify that the backend is accessible:

```bash
curl -X GET https://myc786-todo2.hf.space/health
```

Expected response: `{"status": "healthy"}`

### 2. Frontend-Backend Connectivity

Test that the frontend can reach the backend by checking browser network requests:

1. Open your deployed frontend in a browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Try to access a public endpoint (like health check) or perform authentication
5. Look for requests to your backend URL in the Network tab

### 3. Authentication Flow Test

Test the complete authentication flow:

1. Navigate to the login page on your deployed frontend
2. Try to register a new account
3. Check the Network tab for:
   - Request to `POST /api/v1/auth/` (registration)
   - Successful response with user data
4. Log in with the new account
5. Check for:
   - Request to `POST /api/v1/auth/signin`
   - Successful response with access token
   - Token stored in localStorage

### 4. API Operations Test

Test various API operations:

#### Task Operations:
1. Create a new task
2. Verify the request goes to `POST /api/v1/tasks/`
3. Check that the response contains the created task
4. Update the task
5. Verify the request goes to `PUT /api/v1/tasks/{id}`
6. Delete the task
7. Verify the request goes to `DELETE /api/v1/tasks/{id}`

#### Task Listing:
1. Navigate to the tasks page
2. Verify request to `GET /api/v1/tasks/`
3. Check that tasks are displayed correctly

### 5. CORS Verification

Confirm CORS is properly configured:

1. Check that no CORS errors appear in the browser console
2. Verify that requests to the backend include proper origin headers
3. If using a production domain, ensure your frontend domain is in the backend's `ALLOWED_ORIGINS`

### 6. Error Handling Test

Test error scenarios:

1. Try to access a protected endpoint without authentication
2. Verify you receive a 401 Unauthorized response
3. Check that the frontend handles this appropriately (redirects to login)
4. Try invalid credentials during login
5. Verify appropriate error messages are shown

## Common Issues and Solutions

### Issue: CORS Errors
**Symptoms**: Browser console shows CORS-related errors
**Solution**:
- Verify your frontend domain is in the backend's `ALLOWED_ORIGINS` environment variable
- Check that you're using HTTPS for both frontend and backend in production

### Issue: Network Errors
**Symptoms**: Requests fail with network errors
**Solution**:
- Verify the `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check that the backend is accessible at the configured URL
- Confirm the backend API endpoints are available at `/api/v1/`

### Issue: Authentication Failures
**Symptoms**: Login/register fails consistently
**Solution**:
- Check that the backend's `BETTER_AUTH_SECRET` is properly configured
- Verify the backend is returning valid JWT tokens
- Confirm the frontend is sending the Authorization header correctly

### Issue: 404 Not Found Errors
**Symptoms**: API requests return 404 errors
**Solution**:
- Verify the backend API is mounted at `/api/v1/`
- Check that your `NEXT_PUBLIC_API_BASE_URL` doesn't include `/api/v1/` (the API client adds this)

## Verification Checklist

- [ ] Backend health check returns healthy status
- [ ] Frontend can successfully register new users
- [ ] Frontend can successfully authenticate users
- [ ] Frontend can create, read, update, and delete tasks
- [ ] No CORS errors in browser console
- [ ] Authentication tokens are properly handled
- [ ] Protected routes work correctly
- [ ] Error handling works as expected

## Advanced Testing

For comprehensive testing, you can also:

1. Test concurrent users accessing the application
2. Test with different browsers and devices
3. Perform load testing with tools like Artillery or K6
4. Test offline functionality if implemented
5. Verify data consistency across sessions
