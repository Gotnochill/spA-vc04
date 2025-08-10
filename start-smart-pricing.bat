@echo off
echo ========================================
echo    Smart Pricing AI - Startup Script
echo ========================================
echo.
echo Starting all services...
echo.

REM Change to project directory
cd /d "d:\smartPricing"

REM Check if virtual environment exists
if not exist ".venv" (
    echo ERROR: Virtual environment not found!
    echo Please run: python -m venv .venv
    echo Then install requirements: pip install -r backend/requirements.txt
    pause
    exit /b 1
)

REM Start Backend API Server in new terminal
echo [1/3] Starting Backend FastAPI Server...
start "Smart Pricing - Backend API" cmd /k "cd /d d:\smartPricing && .venv\Scripts\activate && cd backend && echo Backend starting on http://localhost:8000 && uvicorn main:app --reload"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend Development Server in new terminal
echo [2/3] Starting Frontend Next.js Server...
start "Smart Pricing - Frontend" cmd /k "cd /d d:\smartPricing\frontend && echo Frontend starting on http://localhost:3000 && npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

REM Open the web application in default browser
echo [3/3] Opening Smart Pricing AI in browser...
start "" "http://localhost:3000"

echo.
echo ========================================
echo   Smart Pricing AI Successfully Started!
echo ========================================
echo.
echo Services running:
echo   Backend API:  http://localhost:8000
echo   Frontend App: http://localhost:3000
echo.
echo Available pages:
echo   Main Dashboard: http://localhost:3000
echo   Pricing:        http://localhost:3000/pricing
echo   Shipping:       http://localhost:3000/shipping
echo   Invoices:       http://localhost:3000/invoices
echo.
echo Press any key to close this window...
echo (Backend and Frontend will continue running)
pause >nul
