# Troubleshooting Guide: Vercel Frontend and Backend Connection

## Current Status
- Frontend deployed at: https://frontend-mocha-beta-73.vercel.app
- Backend deployed at: https://myc786-todo2.hf.space
- Issue: "Failed to fetch" error indicating connection problems
- Good news: Backend health check confirms the service is running and responding

## Troubleshooting Steps

### 1. Verify Backend Accessibility
The deployed backend at https://myc786-todo2.hf.space IS running and accessible:
- ✅ https://myc786-todo2.hf.space/health returns {"status":"healthy"}
- ✅ https://myc786-todo2.hf.space/ returns {"message":"Todo Backend API is running!"}
- ✅ https://myc786-todo2.hf.space/docs shows API documentation

### 2. Primary Issue: CORS Configuration
The most likely issue is CORS (Cross-Origin Resource Sharing) configuration. The backend needs to allow requests from your Vercel frontend domain:

**Required CORS Origins:**
- `https://frontend-mocha-beta-73.vercel.app`
- `https://frontend-pc6dr97gs-myc786s-projects.vercel.app`
- `https://*.vercel.app` (wildcard)

### 3. Backend Environment Variable
The backend needs to have the `ALLOWED_ORIGINS` environment variable set with the correct Vercel domains:

```
ALLOWED_ORIGINS=https://frontend-mocha-beta-73.vercel.app,https://frontend-pc6dr97gs-myc786s-projects.vercel.app,http://localhost:3000
```

### 4. API Endpoint Format
The frontend expects API endpoints in the format:
- `https://myc786-todo2.hf.space/api/v1/auth/`
- `https://myc786-todo2.hf.space/api/v1/tasks/`
- `https://myc786-todo2.hf.space/api/v1/tags/`

### 5. Resolution Steps
1. **Update your backend environment variables** to include Vercel domains in `ALLOWED_ORIGINS`
2. **Restart your backend service** after updating the environment variables
3. **Test the connection** again

## How to Fix CORS Issue on Hugging Face Spaces:
1. Go to your Hugging Face Space settings
2. Navigate to the "Secrets" or "Environment Variables" section
3. Update or add the `ALLOWED_ORIGINS` variable with the Vercel domains
4. Restart your Space

## Important Notes
- The frontend will automatically append `/api/v1` to the base URL for API calls
- The backend is currently running and healthy, just needs CORS configuration
- Once CORS is fixed, the connection should work immediately