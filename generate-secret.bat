@echo off
echo Generating a secure JWT secret for NextAuth.js...

:: Generate a 32-byte random string using PowerShell
for /f "tokens=*" %%i in ('powershell -Command "[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes(32))"') do set SECRET=%%i

echo.
echo Your secure secret is:
echo %SECRET%
echo.
echo Copy this secret and add it to your environment variables as NEXTAUTH_SECRET
echo.
echo For Vercel deployment:
echo 1. Go to your Vercel project settings
echo 2. Click on "Environment Variables"
echo 3. Add a new variable with name "NEXTAUTH_SECRET"
echo 4. Paste the generated secret as the value
echo.
pause
