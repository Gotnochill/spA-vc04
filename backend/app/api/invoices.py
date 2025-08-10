from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.schemas import Customer, Basket, Invoice, CustomerSegment
from app.services.invoice_generator import InvoiceGenerator

router = APIRouter()
invoice_generator = InvoiceGenerator()

@router.post("/generate", response_model=Invoice)
async def generate_invoice(
    basket: Basket,
    include_promotions: bool = True
):
    """
    Generate a dynamic invoice with adaptive fields based on transaction type,
    geography, and customer segment.
    """
    try:
        invoice = invoice_generator.generate(basket, include_promotions)
        return invoice
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating invoice: {str(e)}")

@router.get("/template/{customer_segment}")
async def get_invoice_template(customer_segment: CustomerSegment):
    """Get invoice template structure for a specific customer segment."""
    try:
        template = invoice_generator.get_template(customer_segment)
        return template
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting template: {str(e)}")

@router.post("/calculate-tariffs")
async def calculate_tariffs(
    basket: Basket,
    origin_country: str = "US"
):
    """Calculate applicable tariffs and duties for international shipments."""
    try:
        tariffs = invoice_generator.calculate_tariffs(basket, origin_country)
        return tariffs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating tariffs: {str(e)}")

@router.post("/apply-promotions")
async def apply_promotions(
    basket: Basket,
    promotion_codes: list[str] = None
):
    """Apply available promotions and calculate discount impact."""
    try:
        result = invoice_generator.apply_promotions(basket, promotion_codes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error applying promotions: {str(e)}")
