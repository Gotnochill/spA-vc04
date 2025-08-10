@echo off
echo Starting Smart Pricing AI System...
echo.

echo [1/3] Checking Python environment...
if not exist ".venv" (
    echo Creating Python virtual environment...
    python -m venv .venv
)

echo [2/3] Installing Python dependencies...
.venv\Scripts\python.exe -m pip install -r backend\requirements.txt

echo [3/3] Starting FastAPI backend server...
echo.
echo Backend will be available at: http://127.0.0.1:8000
echo API Documentation: http://127.0.0.1:8000/docs
echo Demo Dashboard: file://%cd%\demo.html
echo.
echo Press Ctrl+C to stop the server
echo.

cd backend
..\\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
