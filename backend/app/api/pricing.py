from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Customer, Product, PricingRecommendation, CustomerSegment
from app.services.pricing_engine import PricingEngine

router = APIRouter()
pricing_engine = PricingEngine()

@router.post("/recommendations", response_model=List[PricingRecommendation])
async def get_pricing_recommendations(
    customer: Customer,
    products: List[Product]
):
    """
    Get AI-driven pricing recommendations for products based on customer segment,
    historical data, and market conditions.
    """
    try:
        recommendations = pricing_engine.get_recommendations(customer, products)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/customer-segments")
async def get_customer_segments():
    """Get available customer segments for pricing analysis."""
    return [segment.value for segment in CustomerSegment]

@router.post("/price-elasticity")
async def calculate_price_elasticity(
    sku: str,
    price_range: List[float]
):
    """Calculate price elasticity for a product across different price points."""
    try:
        elasticity_data = pricing_engine.calculate_elasticity(sku, price_range)
        return elasticity_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating elasticity: {str(e)}")

@router.post("/margin-analysis")
async def analyze_margins(
    customer: Customer,
    products: List[Product]
):
    """Analyze current margins and optimization opportunities."""
    try:
        analysis = pricing_engine.analyze_margins(customer, products)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing margins: {str(e)}")
