#!/bin/bash
# Prepare frontend for Vercel deployment

echo "Preparing frontend for Vercel deployment..."

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "Error: frontend directory not found!"
    exit 1
fi

echo "Checking frontend directory..."
cd frontend

# Verify Next.js installation
if [ ! -f "node_modules/.bin/next" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Test the build
echo "Testing build..."
if npm run build; then
    echo "Build successful! Ready for Vercel deployment."
    echo ""
    echo "To deploy on Vercel:"
    echo "1. Make sure your backend API is deployed"
    echo "2. Set NEXT_PUBLIC_API_BASE_URL environment variable in Vercel"
    echo "3. Deploy using Vercel CLI: vercel --cwd ."
    echo "   Or import the project in Vercel dashboard with rootDirectory=frontend"
else
    echo "Build failed! Please fix errors before deploying to Vercel."
    exit 1
fi