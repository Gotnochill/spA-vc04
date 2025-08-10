#!/bin/bash

echo "========================================"
echo "   Smart Pricing AI - Startup Script"
echo "========================================"
echo ""

# Change to project directory
cd "d:/smartPricing"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "ERROR: Virtual environment not found!"
    echo "Please run: python -m venv .venv"
    echo "Then install requirements: pip install -r backend/requirements.txt"
    read -p "Press Enter to exit"
    exit 1
fi

# Start Backend API Server in new terminal
echo "[1/3] Starting Backend FastAPI Server..."
start "Smart Pricing - Backend API" bash -c "cd d:/smartPricing && source .venv/Scripts/activate && cd backend && echo 'Backend starting on http://localhost:8000' && uvicorn main:app --reload; exec bash"

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 3

# Start Frontend Development Server in new terminal
echo "[2/3] Starting Frontend Next.js Server..."
start "Smart Pricing - Frontend" bash -c "cd d:/smartPricing/frontend && echo 'Frontend starting on http://localhost:3000' && npm run dev; exec bash"

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 5

# Open the web application in default browser
echo "[3/3] Opening Smart Pricing AI in browser..."
start "http://localhost:3000"

echo ""
echo "========================================"
echo "  Smart Pricing AI Successfully Started!"
echo "========================================"
echo ""
echo "Services running:"
echo "  Backend API:  http://localhost:8000"
echo "  Frontend App: http://localhost:3000"
echo ""
echo "Available pages:"
echo "  Main Dashboard: http://localhost:3000"
echo "  Pricing:        http://localhost:3000/pricing"
echo "  Shipping:       http://localhost:3000/shipping"
echo "  Invoices:       http://localhost:3000/invoices"
echo ""
echo "Press any key to close this window..."
echo "(Backend and Frontend will continue running)"
read -n 1
