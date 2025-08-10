# Smart Pricing AI - Copilot Instructions

This is an AI-driven pricing intelligence system for life sciences e-commerce platforms.

## ✅ Project Setup Complete

### Architecture Overview
- **Backend**: FastAPI with 3 core APIs (Pricing, Shipping, Invoices)
- **Frontend**: Next.js dashboard with TailwindCSS
- **ML Models**: Price optimization, weight inference, customer segmentation
- **Data**: Sample generation and model training scripts
- **Deployment**: Docker-ready with compose configuration

### Key Features Implemented
1. **Smart Pricing Engine**: Customer segmentation, price elasticity, margin analysis
2. **Shipping Cost Estimator**: Weight inference, multi-carrier support, sourcing optimization
3. **Dynamic Invoice Generator**: Adaptive fields, tariff calculation, promotion management

### Development Guidelines
- Focus on life sciences e-commerce specific features
- Prioritize pricing accuracy and invoice adaptability
- Target ±10% shipping prediction accuracy for known weights, ±20% for inferred
- Emphasize usability for pricing and invoicing teams

### Tech Stack
- Frontend: Next.js, React, TypeScript, TailwindCSS
- Backend: FastAPI, Python, Pydantic, SQLAlchemy
- ML: scikit-learn, Prophet, pandas, NumPy
- Database: PostgreSQL
- Deployment: Docker, Docker Compose

### Next Steps
1. Install Python and Node.js on your system
2. Run `python scripts/generate_sample_data.py` to create sample data
3. Run `python scripts/train_models.py` to train ML models
4. Start backend: `uvicorn main:app --reload` (from backend directory)
5. Install frontend deps: `npm install` (from frontend directory)
6. Start frontend: `npm run dev` (from frontend directory)
