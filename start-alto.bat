@echo off
cd /d "%~dp0alto"

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo Starting alto Next.js app...
npm run dev
