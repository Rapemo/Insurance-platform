@echo off
echo 🚀 Starting deployment process...

echo 🔍 Checking dependencies...
:: Install dependencies
call npm ci

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo 🧪 Running tests...
:: Run tests
call npm test

if errorlevel 1 (
    echo ❌ Tests failed
    exit /b 1
)

:: Build the application
echo 🏗️ Building application...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

echo 📦 Preparing for deployment...
:: Create or update .env file
if not exist .env (
    copy env.example .env
)

:: Run database migrations
if exist "supabase\migrations" (
    echo 🔄 Running database migrations...
    :: This assumes you have the Supabase CLI installed
    :: You may need to adjust this command based on your setup
    supabase db push
)

echo 🚀 Deploying to Vercel...
:: Deploy to Vercel
call npx vercel --prod

echo ✅ Deployment complete!
exit /b 0
