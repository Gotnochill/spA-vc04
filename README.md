# Smart Pricing AI

An AI-driven pricing intelligence system for life sciences e-commerce platforms. This system optimizes pricing strategies, estimates shipping costs, and generates dynamic invoices for laboratory equipment, reagents, and consumables.

## Overview

Smart Pricing AI addresses the complex pricing challenges in life sciences e-commerce by providing three integrated tools:

- **Smart Pricing Engine**: Customer segmentation and price optimization
- **Shipping Cost Estimator**: ML-powered weight inference and cost calculation
- **Dynamic Invoice Generator**: Adaptive invoice structures with tariffs and fees

## Quick Start

### One-Click Startup (Windows)
1. Open Command Prompt as Administrator
2. Navigate to project directory: `cd d:\smartPricing`
3. Run: `start-smart-pricing.bat`

This automatically starts both backend and frontend servers and opens the application in your browser.

### Manual Setup
```bash
# Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
cd backend
uvicorn main:app --reload

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## Application URLs

- **Frontend Dashboard**: http://localhost:3000
- **Pricing Tool**: http://localhost:3000/pricing
- **Shipping Tool**: http://localhost:3000/shipping
- **Invoice Tool**: http://localhost:3000/invoices
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Core Features

### Smart Pricing Engine
- Customer segmentation (Academic, Enterprise, Government, Startup, Pharmaceutical)
- Price optimization based on customer type and order volume
- Margin analysis and revenue projections
- PDF export of pricing recommendations

### Shipping Cost Estimator
- Weight inference for products with missing weight data
- Multi-carrier support (FedEx, UPS, DHL)
- International shipping with customs and tariff calculations
- Sourcing optimization across multiple locations

### Dynamic Invoice Generator
- Adaptive invoice fields based on customer type and region
- Automatic tax and tariff calculations
- Promotion and discount management
- Professional PDF invoice generation

## Technical Architecture

### Backend (FastAPI)
- RESTful APIs for pricing, shipping, and invoice operations
- Machine learning models for weight inference and customer segmentation
- Business logic for pricing optimization and cost calculations

### Frontend (Next.js)
- React-based dashboard with TypeScript
- Interactive forms for pricing and shipping estimation
- PDF export functionality for reports and invoices
- Responsive design with TailwindCSS

### Machine Learning Models
- Random Forest models for price prediction and weight inference
- K-means clustering for customer segmentation
- Rule-based pricing algorithms with ML enhancements

## Sample Data

The system includes generated sample data for demonstration:
- 1000+ life sciences products across multiple categories
- 200+ customers representing different market segments
- 5000+ historical transactions for model training
- Realistic pricing patterns and shipping weights

## Technology Stack

- **Backend**: Python, FastAPI, scikit-learn, pandas, NumPy
- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **PDF Generation**: jsPDF
- **Development**: Docker-ready with environment configuration

## Documentation

- **Quick Start Guide**: See `QUICK_START.md` for detailed setup instructions
- **FAQ**: See `SMART_PRICING_FAQ.md` for technical questions and explanations
- **API Documentation**: Available at http://localhost:8000/docs when backend is running

## Project Structure

```
smartPricing/
├── backend/              # FastAPI application
├── frontend/             # Next.js application
├── data/                 # Sample CSV data files
├── ml_models/            # Trained ML models
├── scripts/              # Data generation and model training
└── start-smart-pricing.* # One-click startup scripts
```