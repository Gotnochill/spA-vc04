# Smart Pricing AI - Quick Start Guide

## Running Locally - One Command Startup

**To start the entire Smart Pricing AI system with one command:**

1. Open **Command Prompt** (cmd) as Administrator
2. Navigate to the project directory: `cd d:\smartPricing`
3. Run: `start-smart-pricing.bat`

This will automatically:
- Start the backend FastAPI server on port 8000
- Start the frontend Next.js server on port 3000
- Open your browser to http://localhost:3000
- Display all available URLs and services

## Alternative Startup Methods

Choose your preferred method based on your terminal:

### Windows Command Prompt
```bash
start-smart-pricing.bat
```

### PowerShell
```powershell
.\start-smart-pricing.ps1
```

### Git Bash
```bash
./start-smart-pricing.sh
```

## What the startup script does

1. Checks Prerequisites: Verifies virtual environment exists
2. Starts Backend: Opens new terminal running FastAPI server on port 8000
3. Starts Frontend: Opens new terminal running Next.js dev server on port 3000
4. Opens Browser: Automatically opens http://localhost:3000
5. Shows Status: Displays all running services and available URLs

## After startup, you'll have

- **Backend API**: http://localhost:8000
- **Frontend App**: http://localhost:3000
- **Main Dashboard**: http://localhost:3000
- **Pricing Tool**: http://localhost:3000/pricing
- **Shipping Tool**: http://localhost:3000/shipping
- **Invoice Tool**: http://localhost:3000/invoices

## Manual Startup (if scripts don't work)

### Terminal 1 - Backend
```bash
cd d:\smartPricing
source .venv/Scripts/activate
cd backend
uvicorn main:app --reload
```

### Terminal 2 - Frontend
```bash
cd d:\smartPricing\frontend
npm run dev
```

### Then open: http://localhost:3000

## Troubleshooting

- **Virtual environment missing**: Run `python -m venv .venv` then `pip install -r backend/requirements.txt`
- **Port conflicts**: Kill existing processes or change ports in the scripts
- **Permission issues**: Run Command Prompt as administrator

## Features Available

**Smart Pricing Engine** - AI-powered price optimization with PDF export  
**Shipping Cost Estimator** - Multi-carrier shipping with weight inference  
**Dynamic Invoice Generator** - Adaptive invoicing with tariff calculations  
**Integrated Dashboard** - Complete life sciences e-commerce intelligence
