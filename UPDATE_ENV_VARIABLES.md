# Environment Variables Update Guide

This document explains how to properly configure environment variables for production deployment.

## Frontend Environment Variables (Vercel)

When deploying the frontend to Vercel, you need to set the following environment variables:

### NEXT_PUBLIC_API_BASE_URL
- **Purpose**: Points the frontend to your deployed backend API
- **Format**: The base URL of your backend (do NOT include `/api/v1` - the API client will append this automatically)
- **Example**: `https://myc786-todo2.hf.space`
- **Note**: The API client will automatically append `/api/v1` to this URL for all API calls

## Backend Environment Variables (Hugging Face Spaces/Render/Railway)

When deploying the backend, you need to set the following environment variables:

### DATABASE_URL
- **Purpose**: Connection string for your PostgreSQL database
- **Format**: `postgresql://username:password@hostname:port/database_name`
- **Example**: `postgresql://myuser:mypassword@ep-old-smoke-123456.us-east-1.aws.neon.tech/mydb?sslmode=require`

### BETTER_AUTH_SECRET
- **Purpose**: Secret key for JWT token generation and validation
- **Format**: Random string of at least 32 characters
- **Example**: `mySuperSecretKeyThatIsAtLeastThirtyTwoCharactersLong`
- **Security**: This should be kept private and never exposed in client-side code

### ALLOWED_ORIGINS
- **Purpose**: Comma-separated list of origins allowed to make requests to your backend
- **Format**: List of URLs separated by commas
- **Example**: `https://my-todo-app.vercel.app,http://localhost:3000,http://localhost:3001`
- **Note**: Include your Vercel frontend URL and any local development URLs

## Updating Environment Variables on Vercel

1. Go to your project dashboard on Vercel
2. Navigate to your deployed project
3. Go to Settings → Environment Variables
4. Add or update the variables as needed
5. Redeploy your project for changes to take effect

## Updating Environment Variables on Hugging Face Spaces

1. Go to your Space on Hugging Face
2. Click on the "Files" tab
3. Find the "Settings" or "Environment variables" section
4. Add or update the variables as needed
5. Restart your Space for changes to take effect

## Updating Environment Variables on Render/Railway

1. Go to your service on Render/Railway dashboard
2. Navigate to Environment section
3. Add or update the variables as needed
4. Deploy/restart your service for changes to take effect

## Verification

After updating environment variables:

1. Verify the frontend can reach the backend by checking the Network tab in browser dev tools
2. Test authentication and API operations
3. Check server logs for any CORS or connection errors
