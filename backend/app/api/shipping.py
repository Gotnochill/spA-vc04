from fastapi import APIRouter, HTTPException
from app.models.schemas import Basket, ShippingEstimate
from app.services.shipping_estimator import ShippingEstimator

router = APIRouter()
shipping_estimator = ShippingEstimator()

@router.post("/estimate", response_model=ShippingEstimate)
async def estimate_shipping_cost(basket: Basket):
    """
    Estimate shipping costs for a basket including weight inference
    and multi-country sourcing optimization.
    """
    try:
        estimate = shipping_estimator.estimate_cost(basket)
        return estimate
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error estimating shipping: {str(e)}")

@router.post("/weight-inference")
async def infer_product_weights(skus: list[str]):
    """Infer missing product weights using ML models and historical data."""
    try:
        weights = shipping_estimator.infer_weights(skus)
        return weights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inferring weights: {str(e)}")

@router.get("/carriers")
async def get_available_carriers():
    """Get list of available shipping carriers and their service levels."""
    return shipping_estimator.get_carriers()

@router.post("/optimize-sourcing")
async def optimize_sourcing(basket: Basket):
    """Optimize sourcing locations to minimize shipping costs."""
    try:
        optimization = shipping_estimator.optimize_sourcing(basket)
        return optimization
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error optimizing sourcing: {str(e)}")
