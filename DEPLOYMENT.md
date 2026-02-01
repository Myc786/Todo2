# Deploying on Vercel

This guide explains how to deploy the frontend application on Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. The Vercel CLI installed (optional): `npm install -g vercel`
3. A deployed backend API (see backend deployment instructions below)

## Deployment Steps

### Option 1: Using the Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will detect that it's a Next.js project
5. Set the Root Directory to `frontend`
6. Configure Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Set this to your deployed backend API URL (e.g., `https://your-backend-app.onrender.com/api/v1`)
7. Click "Deploy"

### Option 2: Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd frontend
   ```

3. Link your project:
   ```bash
   vercel --cwd .
   ```

4. When prompted, set the following:
   - Root Directory: `frontend` (if prompted)
   - Environment Variables:
     - `NEXT_PUBLIC_API_BASE_URL`: Set this to your deployed backend API URL

5. The CLI will deploy your project and provide a URL

## Environment Variables

The application requires the following environment variable to be set in Vercel:

- `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed backend API (e.g., `https://myc786-todo2.hf.space`)

### Backend Environment Variables

When deploying the backend, ensure these environment variables are configured:

- `DATABASE_URL`: PostgreSQL database connection string
- `BETTER_AUTH_SECRET`: JWT secret for authentication (at least 32 characters)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., "https://your-frontend.vercel.app,http://localhost:3000")

## Backend Deployment

This frontend application requires a backend API to function. The backend is located in the `backend` directory and is built with FastAPI and SQLModel. You must deploy the backend first before deploying the frontend.

### Backend Deployment Options:

#### Option A: Deploy on Hugging Face Spaces (Recommended)
1. Create an account on [Hugging Face](https://huggingface.co)
2. Create a new Space with the "Docker" option
3. Connect to your Git repository or upload the backend code
4. Use the following Dockerfile for containerization:
   ```Dockerfile
   FROM python:3.10-slim

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install -r requirements.txt

   COPY . .

   EXPOSE 7860

   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
   ```
5. Set environment variables in the Space settings:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `BETTER_AUTH_SECRET`: Your JWT secret for authentication
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., "https://your-frontend.vercel.app,http://localhost:3000")
6. Deploy the backend and note the URL (typically in the format `https://username-space-name.hf.space`)
7. Use this URL in the frontend's `NEXT_PUBLIC_API_BASE_URL` variable

#### Option B: Deploy on Render
1. Create a free account on [Render](https://render.com)
2. Create a new Web Service
3. Connect to your Git repository
4. Set the runtime to Python
5. Set the build command to: `pip install -r requirements.txt`
6. Set the start command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Configure environment variables in Render:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `BETTER_AUTH_SECRET`: Your JWT secret for authentication
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., "https://your-frontend.vercel.app,http://localhost:3000")
8. Deploy the backend and note the URL
9. Use this URL in the frontend's `NEXT_PUBLIC_API_BASE_URL` variable

#### Option C: Deploy on Railway
1. Create an account on [Railway](https://railway.app)
2. Import your repository
3. Set the deploy command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add a PostgreSQL database through Railway's marketplace
5. Configure environment variables:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `BETTER_AUTH_SECRET`: Your JWT secret for authentication
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins
6. Deploy and get the backend URL

## Custom Configuration

The project includes a `vercel.json` file in the root directory with the following configuration:

```json
{
  "framework": "nextjs",
  "rootDirectory": "frontend"
}
```

This tells Vercel to treat the `frontend` directory as a standalone Next.js project.

## API Endpoints

The frontend expects the following API endpoints to be available at the configured `NEXT_PUBLIC_API_BASE_URL`:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /tags` - Get user's tags
- `POST /tags` - Create a new tag

## Troubleshooting

- If the deployment fails, check that the `frontend` directory contains a valid Next.js application
- Verify that all dependencies are listed in the root `package.json`
- Ensure the environment variables are correctly configured in the Vercel dashboard
- Check that your backend API is accessible from the deployed frontend
- Verify CORS settings in your backend to allow requests from your frontend domain
- Check browser console for API errors after deployment

## Post-Deployment

After successful deployment:

1. Visit your deployed URL
2. Ensure the login/signup functionality works
3. Verify that API calls to your backend are functioning correctly
4. Test task creation, editing, and deletion functionality
5. Check that all API endpoints are working as expected