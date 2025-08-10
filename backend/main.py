from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.api import pricing, shipping, invoices

app = FastAPI(
    title="Smart Pricing AI",
    description="AI-driven pricing intelligence for life sciences e-commerce",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(pricing.router, prefix="/api/pricing", tags=["pricing"])
app.include_router(shipping.router, prefix="/api/shipping", tags=["shipping"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["invoices"])

@app.get("/")
async def root():
    return {"message": "Smart Pricing AI - Life Sciences E-Commerce Intelligence"}
