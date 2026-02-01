# Vercel Environment Variables Setup Guide

This guide explains how to properly configure environment variables for the frontend when deploying to Vercel.

## Required Environment Variables

### NEXT_PUBLIC_API_BASE_URL
- **Type**: Environment Variable
- **Required**: Yes
- **Prefix**: Must start with `NEXT_PUBLIC_` to be accessible in the browser
- **Value**: Your deployed backend URL (without `/api/v1` suffix)

## Step-by-Step Setup

### Option 1: Using Vercel Dashboard

1. Navigate to your project on the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Todo application project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://myc786-todo2.hf.space` (replace with your actual backend URL)
5. Click "Add" to save the variable
6. Go to the "Deployments" tab and redeploy your project by clicking "Redeploy all"

### Option 2: Using Vercel CLI

1. Make sure you have the Vercel CLI installed:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your frontend directory:
   ```bash
   cd frontend
   ```

3. Set the environment variable:
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL production
   ```

   When prompted, enter: `https://myc786-todo2.hf.space`

4. Redeploy your project:
   ```bash
   vercel --prod
   ```

## Important Notes

- The API client in the frontend automatically appends `/api/v1` to the base URL for all API requests
- Do NOT include `/api/v1` in the `NEXT_PUBLIC_API_BASE_URL` value
- The URL should be the root URL of your backend (e.g., `https://myc786-todo2.hf.space`)
- Use HTTPS in production for security

## Verification Steps

After setting up the environment variable:

1. Deploy your frontend application
2. Open your deployed application in a browser
3. Open Developer Tools (F12) and go to the Network tab
4. Try to perform an API operation (like logging in)
5. Verify that requests are being sent to the correct backend URL
6. Check that there are no CORS errors in the console

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure your backend's `ALLOWED_ORIGINS` includes your Vercel domain
   - Example: If your frontend is at `https://my-todo-app.vercel.app`, add this to your backend's `ALLOWED_ORIGINS`

2. **API Requests Going to Wrong URL**:
   - Verify that `NEXT_PUBLIC_API_BASE_URL` does NOT include `/api/v1`
   - The API client handles appending the API version automatically

3. **Environment Variable Not Applied**:
   - Ensure you've redeployed after adding the environment variable
   - Environment variables are applied at build time, not runtime

## Example Values

- ✅ Correct: `NEXT_PUBLIC_API_BASE_URL=https://myc786-todo2.hf.space`
- ❌ Incorrect: `NEXT_PUBLIC_API_BASE_URL=https://myc786-todo2.hf.space/api/v1`

With the correct setup, API calls will be made to `https://myc786-todo2.hf.space/api/v1/tasks/` automatically.
