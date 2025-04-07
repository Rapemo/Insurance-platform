#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

echo "🔍 Checking dependencies..."
# Install dependencies
npm ci

echo "🧪 Running tests..."
# Run tests
npm test

# Build the application
echo "🏗️ Building application..."
npm run build

echo "📦 Preparing for deployment..."
# Create or update .env file
if [ ! -f .env ]; then
  cp env.example .env
fi

# Run database migrations
if [ -d "supabase/migrations" ]; then
  echo "🔄 Running database migrations..."
  # This assumes you have the Supabase CLI installed
  # You may need to adjust this command based on your setup
  supabase db push
fi

echo "🚀 Deploying to Vercel..."
# Deploy to Vercel
npx vercel --prod

echo "✅ Deployment complete!"
