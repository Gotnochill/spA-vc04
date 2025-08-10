from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class CustomerSegment(str, Enum):
    ACADEMIC = "academic"
    BIOTECH_STARTUP = "biotech_startup"
    PHARMA_ENTERPRISE = "pharma_enterprise"
    RESEARCH_INSTITUTE = "research_institute"

class ProductCategory(str, Enum):
    REAGENTS = "reagents"
    LAB_EQUIPMENT = "lab_equipment"
    CONSUMABLES = "consumables"
    INSTRUMENTS = "instruments"
    CHEMICALS = "chemicals"

class Customer(BaseModel):
    id: str
    name: str
    segment: CustomerSegment
    location: str
    country: str
    tax_exempt: bool = False

class Product(BaseModel):
    sku: str
    name: str
    category: ProductCategory
    supplier: str
    weight_kg: Optional[float] = None
    dimensions: Optional[Dict[str, float]] = None  # length, width, height in cm
    base_price: float
    hs_code: Optional[str] = None  # For tariff calculations

class BasketItem(BaseModel):
    product: Product
    quantity: int
    unit_price: float

class Basket(BaseModel):
    items: List[BasketItem]
    customer: Customer
    destination_country: str
    destination_zip: str

class PricingRecommendation(BaseModel):
    sku: str
    recommended_price: float
    confidence_score: float
    margin_improvement: float
    reasoning: str

class ShippingEstimate(BaseModel):
    total_cost: float
    breakdown: Dict[str, float]  # base_cost, fuel_surcharge, handling, etc.
    estimated_weight: float
    carrier_options: List[Dict[str, Any]]

class InvoiceLineItem(BaseModel):
    sku: str
    description: str
    quantity: int
    unit_price: float
    line_total: float
    tax_rate: float
    tariff_rate: Optional[float] = None

class DynamicField(BaseModel):
    field_name: str
    field_value: float
    description: str

class Invoice(BaseModel):
    invoice_id: str
    customer: Customer
    line_items: List[InvoiceLineItem]
    subtotal: float
    tax_total: float
    shipping_cost: float
    dynamic_fields: List[DynamicField]  # tariffs, service fees, handling charges
    total: float
    currency: str = "USD"
    created_at: datetime
