#!/bin/bash

# Smart Pricing AI - Quick Start Script
# This script starts both frontend and backend servers

echo "🚀 Starting Smart Pricing AI Platform..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the Smart Pricing AI root directory"
    exit 1
fi

# Start backend server in background
echo "🔧 Starting Backend Server (FastAPI)..."
cd backend
D:/smartPricing/.venv/Scripts/python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting Frontend Server (Next.js)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Smart Pricing AI is now running!"
echo "=================================="
echo "🌐 Frontend (Dashboard): http://localhost:3000"
echo "🔧 Backend (API): http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "💡 Features:"
echo "   • AI-Powered Pricing Optimization"
echo "   • Intelligent Shipping Cost Estimation"
echo "   • Dynamic Invoice Generation"
echo "   • Customer Segmentation"
echo "   • Weight Inference from Dimensions"
echo ""
echo "⌨️  Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Cleanup complete"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for user to exit
wait
