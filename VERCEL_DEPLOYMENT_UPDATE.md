# Vercel Deployment Update Guide

This guide provides instructions for updating and managing the Vercel deployment of the Todo frontend application.

## Current Status

The frontend application is ready for Vercel deployment with:
- ✅ Successful build completion
- ✅ Proper API integration with backend
- ✅ Environment variable configuration
- ✅ Optimized production build

## Vercel Configuration

The project includes a `vercel.json` file in the root directory with the following configuration:

```json
{
  "framework": "nextjs",
  "rootDirectory": "frontend"
}
```

This tells Vercel to treat the `frontend` directory as a standalone Next.js project.

## Deployment Steps

### Option 1: Using the Vercel Dashboard

1. Push your updated code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Select your existing project or create a new one
4. Vercel will detect that it's a Next.js project
5. Ensure the Root Directory is set to `frontend`
6. Update Environment Variables if needed:
   - `NEXT_PUBLIC_API_BASE_URL`: Set this to your deployed backend API URL (e.g., `https://your-backend-app.onrender.com`)
7. Click "Deploy"

### Option 2: Using the Vercel CLI

1. Install the Vercel CLI if not already installed:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Deploy using the Vercel CLI:
   ```bash
   vercel --cwd .
   ```

4. When prompted, ensure the following settings:
   - Root Directory: `frontend` (if prompted)
   - Environment Variables:
     - `NEXT_PUBLIC_API_BASE_URL`: Set this to your deployed backend API URL

5. The CLI will deploy your project and provide an updated URL

## Environment Variables

The application requires the following environment variable to be set in Vercel:

- `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed backend API (e.g., `https://myc786-todo2.hf.space`)

### Important Notes:
- The API client automatically appends `/api/v1` to the base URL
- For local development: `http://localhost:8000`
- For production: Your deployed backend URL (without `/api/v1` suffix)

## Backend Requirements

For the frontend to function properly, ensure your backend is deployed and configured with:

- CORS settings allowing your Vercel frontend domain
- Proper authentication and database connectivity
- API endpoints available at `/api/v1/{endpoint}`

## Deployment Verification

After deployment, verify:

1. Visit your deployed URL
2. Ensure the login/signup functionality works
3. Verify that API calls to your backend are functioning correctly
4. Test task creation, editing, and deletion functionality
5. Check that all API endpoints are working as expected
6. Confirm the application loads without errors

## Updating an Existing Deployment

To update an existing Vercel deployment:

1. **Push changes to your Git repository** - If connected to Vercel, deployments trigger automatically
2. **Or use the Vercel CLI**:
   ```bash
   cd frontend
   vercel --prod
   ```
3. **Or redeploy from the Vercel dashboard** - Go to your project and click "Deploy"

## Common Issues and Solutions

- **Build failures**: Ensure all dependencies are in package.json and build works locally with `npm run build`
- **API connection errors**: Verify `NEXT_PUBLIC_API_BASE_URL` is correctly set in Vercel environment variables
- **CORS errors**: Check that your backend allows requests from your Vercel domain
- **Environment variables not loading**: Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access

## Best Practices

- Always test the build locally before deploying: `npm run build`
- Use environment variables for API endpoints to support different environments
- Monitor the Vercel deployment logs for any issues
- Set up custom domains if needed
- Configure branch deploys for development/staging environments

## Troubleshooting

If deployment fails:

1. Check that the `frontend` directory contains a valid Next.js application
2. Verify that all dependencies are listed in the root `package.json`
3. Ensure the environment variables are correctly configured in the Vercel dashboard
4. Check that your backend API is accessible from the deployed frontend
5. Verify CORS settings in your backend to allow requests from your frontend domain
6. Check browser console for API errors after deployment

Your frontend is ready for Vercel deployment. The build has been tested and confirmed working!