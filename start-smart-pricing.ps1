# Smart Pricing AI - PowerShell Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Smart Pricing AI - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location "d:\smartPricing"

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "ERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run: python -m venv .venv" -ForegroundColor Yellow
    Write-Host "Then install requirements: pip install -r backend/requirements.txt" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Function to start processes in new windows
function Start-ServiceWindow {
    param (
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory
    )
    
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "cmd.exe"
    $processInfo.Arguments = "/k `"cd /d $WorkingDirectory && $Command`""
    $processInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Normal
    $processInfo.CreateNoWindow = $false
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $processInfo
    $process.Start()
}

# Start Backend API Server
Write-Host "[1/3] Starting Backend FastAPI Server..." -ForegroundColor Green
Start-ServiceWindow -Title "Smart Pricing - Backend API" -Command ".venv\Scripts\activate && cd backend && echo Backend starting on http://localhost:8000 && uvicorn main:app --reload" -WorkingDirectory "d:\smartPricing"

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Frontend Development Server
Write-Host "[2/3] Starting Frontend Next.js Server..." -ForegroundColor Green
Start-ServiceWindow -Title "Smart Pricing - Frontend" -Command "echo Frontend starting on http://localhost:3000 && npm run dev" -WorkingDirectory "d:\smartPricing\frontend"

# Wait for frontend to start
Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open the web application in default browser
Write-Host "[3/3] Opening Smart Pricing AI in browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Smart Pricing AI Successfully Started!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor White
Write-Host "  Backend API:  http://localhost:8000" -ForegroundColor Green
Write-Host "  Frontend App: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Available pages:" -ForegroundColor White
Write-Host "  Main Dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Pricing:        http://localhost:3000/pricing" -ForegroundColor Cyan
Write-Host "  Shipping:       http://localhost:3000/shipping" -ForegroundColor Cyan
Write-Host "  Invoices:       http://localhost:3000/invoices" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
Write-Host "(Backend and Frontend will continue running)" -ForegroundColor Gray
Read-Host
