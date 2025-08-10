@echo off
echo 🚀 Starting Smart Pricing AI Platform...
echo ==================================

REM Check if we're in the right directory
if not exist "README.md" (
    echo ❌ Please run this script from the Smart Pricing AI root directory
    pause
    exit /b 1
)

echo 🔧 Starting Backend Server (FastAPI)...
start "Smart Pricing Backend" cmd /k "cd backend && D:\smartPricing\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Server (Next.js)...
start "Smart Pricing Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Smart Pricing AI is now running!
echo ==================================
echo 🌐 Frontend (Dashboard): http://localhost:3000
echo 🔧 Backend (API): http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo 💡 Features:
echo    • AI-Powered Pricing Optimization
echo    • Intelligent Shipping Cost Estimation
echo    • Dynamic Invoice Generation
echo    • Customer Segmentation
echo    • Weight Inference from Dimensions
echo.
echo 📝 Close the terminal windows to stop the servers
pause
