@echo off
echo 🚀 Starting Smart Pricing AI System with Virtual Environment...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create virtual environment if it doesn't exist
if not exist "%~dp0venv" (
    echo 🔧 Creating virtual environment...
    cd /d %~dp0
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment and install backend dependencies
echo 📦 Setting up Python environment and installing dependencies...
cd /d %~dp0
call venv\Scripts\activate.bat
pip install -r backend\requirements.txt
pip install plotly seaborn beautifulsoup4
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd /d %~dp0\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 🎯 Setting up real life sciences data...
cd /d %~dp0
python scripts\real_lifesciences_catalogs.py

echo 🚀 Starting services...

REM Start backend in virtual environment
echo 🔧 Starting advanced pricing backend API server...
cd /d %~dp0
start "Smart Pricing Backend" cmd /k "call venv\Scripts\activate.bat && cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 8 /nobreak >nul

REM Start frontend
echo 🎨 Starting Next.js frontend dashboard...
cd /d %~dp0\frontend
start "Smart Pricing Frontend" cmd /k "npm run dev"

REM Wait for services to start
timeout /t 5 /nobreak >nul

echo ✅ Smart Pricing AI System is starting up!
echo 🧠 Advanced ML Features: Prophet, Customer Segmentation, Price Elasticity
echo 🔬 Real Data: Thermo Fisher, Sigma-Aldrich, Bio-Rad, Eppendorf (172 products)
echo 📊 Analytics: 5000 real-world transactions, Revenue optimization
echo.
echo 🌐 Frontend Dashboard: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo Press any key to open the dashboard...
pause >nul

REM Open the dashboard in default browser
start http://localhost:3000

echo 🎉 Smart Pricing AI System is now running with advanced ML features!
echo Press any key to exit...
pause >nul
