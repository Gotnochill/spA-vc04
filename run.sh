#!/bin/bash

echo "🚀 Starting Smart Pricing AI System with Virtual Environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Get the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment and install backend dependencies
echo "� Setting up Python environment and installing dependencies..."
source venv/bin/activate
pip install -r backend/requirements.txt
pip install plotly seaborn beautifulsoup4
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo "🎯 Setting up real life sciences data..."
python scripts/real_lifesciences_catalogs.py

echo "🚀 Starting services..."

# Start backend in virtual environment
echo "🔧 Starting advanced pricing backend API server..."
source venv/bin/activate
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Wait for backend to start
sleep 8

# Start frontend
echo "🎨 Starting Next.js frontend dashboard..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cd ..

# Wait for services to start
sleep 5

echo "✅ Smart Pricing AI System is starting up!"
echo "🧠 Advanced ML Features: Prophet, Customer Segmentation, Price Elasticity"
echo "🔬 Real Data: Thermo Fisher, Sigma-Aldrich, Bio-Rad, Eppendorf (172 products)"
echo "📊 Analytics: 5000 real-world transactions, Revenue optimization"
echo ""
echo "🌐 Frontend Dashboard: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services..."

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping Smart Pricing AI System..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup SIGINT

# Wait for user to press Ctrl+C
wait
