import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    Basket, Invoice, InvoiceLineItem, DynamicField, 
    CustomerSegment, ProductCategory
)

class InvoiceGenerator:
    def __init__(self):
        # Tariff rates by HS code (simplified for demo)
        self.tariff_rates = {
            "3822": 0.035,  # Reagents
            "9027": 0.025,  # Instruments
            "3926": 0.045,  # Plastic consumables
            "7020": 0.030,  # Glass equipment
        }
        
        # Service fees by customer segment
        self.service_fees = {
            CustomerSegment.ACADEMIC: 0.02,      # 2% service fee
            CustomerSegment.BIOTECH_STARTUP: 0.025,  # 2.5%
            CustomerSegment.PHARMA_ENTERPRISE: 0.015, # 1.5% (volume discount)
            CustomerSegment.RESEARCH_INSTITUTE: 0.02  # 2%
        }
    
    def generate(self, basket: Basket, include_promotions: bool = True) -> Invoice:
        """Generate a dynamic invoice with adaptive fields."""
        invoice_id = f"INV-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Create line items
        line_items = []
        subtotal = 0
        
        for item in basket.items:
            # Calculate unit price (could be optimized price from pricing engine)
            unit_price = item.unit_price
            line_total = unit_price * item.quantity
            
            # Tax rate based on product category and location
            tax_rate = self._get_tax_rate(item.product.category, basket.destination_country)
            
            # Tariff rate for international shipments
            tariff_rate = None
            if basket.customer.country.upper() != basket.destination_country.upper():
                tariff_rate = self.tariff_rates.get(item.product.hs_code, 0.05)
            
            line_item = InvoiceLineItem(
                sku=item.product.sku,
                description=item.product.name,
                quantity=item.quantity,
                unit_price=unit_price,
                line_total=line_total,
                tax_rate=tax_rate,
                tariff_rate=tariff_rate
            )
            
            line_items.append(line_item)
            subtotal += line_total
        
        # Calculate taxes
        tax_total = sum(item.line_total * item.tax_rate for item in line_items)
        
        # Calculate shipping (simplified - would integrate with shipping estimator)
        shipping_cost = self._calculate_shipping(basket)
        
        # Generate dynamic fields
        dynamic_fields = self._generate_dynamic_fields(basket, subtotal)
        
        # Apply promotions if requested
        if include_promotions:
            promotion_discount = self._apply_promotions(basket, subtotal)
            if promotion_discount > 0:
                dynamic_fields.append(
                    DynamicField(
                        field_name="promotion_discount",
                        field_value=-promotion_discount,
                        description="Promotional discount applied"
                    )
                )
        
        # Calculate total
        dynamic_total = sum(field.field_value for field in dynamic_fields)
        total = subtotal + tax_total + shipping_cost + dynamic_total
        
        return Invoice(
            invoice_id=invoice_id,
            customer=basket.customer,
            line_items=line_items,
            subtotal=subtotal,
            tax_total=tax_total,
            shipping_cost=shipping_cost,
            dynamic_fields=dynamic_fields,
            total=total,
            created_at=datetime.now()
        )
    
    def get_template(self, customer_segment: CustomerSegment) -> Dict[str, Any]:
        """Get invoice template structure for a customer segment."""
        base_template = {
            "required_fields": [
                "invoice_id", "customer_info", "line_items", 
                "subtotal", "tax_total", "total"
            ],
            "optional_fields": ["shipping_cost", "dynamic_fields"],
            "payment_terms": "Net 30"
        }
        
        # Segment-specific customizations
        segment_customizations = {
            CustomerSegment.ACADEMIC: {
                "tax_exempt_eligible": True,
                "educational_discount": True,
                "payment_terms": "Net 45",
                "required_po_number": True
            },
            CustomerSegment.BIOTECH_STARTUP: {
                "payment_terms": "Net 15",
                "credit_check_required": True,
                "volume_discounts": False
            },
            CustomerSegment.PHARMA_ENTERPRISE: {
                "payment_terms": "Net 60",
                "volume_discounts": True,
                "custom_pricing": True,
                "dedicated_account_manager": True
            },
            CustomerSegment.RESEARCH_INSTITUTE: {
                "grant_funding_fields": True,
                "payment_terms": "Net 45",
                "bulk_order_discounts": True
            }
        }
        
        template = {**base_template, **segment_customizations.get(customer_segment, {})}
        return template
    
    def calculate_tariffs(self, basket: Basket, origin_country: str = "US") -> Dict[str, Any]:
        """Calculate applicable tariffs and duties."""
        if basket.destination_country.upper() == origin_country.upper():
            return {"total_tariffs": 0, "items": [], "notes": "Domestic shipment - no tariffs"}
        
        tariff_items = []
        total_tariffs = 0
        
        for item in basket.items:
            hs_code = item.product.hs_code or "0000"  # Default if no HS code
            tariff_rate = self.tariff_rates.get(hs_code, 0.05)  # 5% default
            item_value = item.unit_price * item.quantity
            tariff_amount = item_value * tariff_rate
            
            tariff_items.append({
                "sku": item.product.sku,
                "hs_code": hs_code,
                "value": item_value,
                "tariff_rate": tariff_rate,
                "tariff_amount": round(tariff_amount, 2)
            })
            
            total_tariffs += tariff_amount
        
        return {
            "total_tariffs": round(total_tariffs, 2),
            "origin_country": origin_country,
            "destination_country": basket.destination_country,
            "items": tariff_items,
            "notes": "Tariff rates are estimates and subject to customs verification"
        }
    
    def apply_promotions(self, basket: Basket, promotion_codes: Optional[List[str]] = None) -> Dict[str, Any]:
        """Apply available promotions and calculate impact."""
        subtotal = sum(item.unit_price * item.quantity for item in basket.items)
        
        # Demo promotions
        available_promotions = {
            "ACADEMIC10": {"type": "percentage", "value": 0.10, "min_order": 100},
            "BULK20": {"type": "percentage", "value": 0.20, "min_order": 1000},
            "NEWCUSTOMER15": {"type": "percentage", "value": 0.15, "min_order": 50},
            "FREESHIP": {"type": "free_shipping", "value": 0, "min_order": 200}
        }
        
        applied_promotions = []
        total_discount = 0
        
        # Auto-apply eligible promotions
        if basket.customer.segment == CustomerSegment.ACADEMIC and subtotal >= 100:
            promo = available_promotions["ACADEMIC10"]
            discount = subtotal * promo["value"]
            applied_promotions.append({
                "code": "ACADEMIC10",
                "description": "Academic discount",
                "discount_amount": round(discount, 2)
            })
            total_discount += discount
        
        if subtotal >= 1000:
            promo = available_promotions["BULK20"]
            discount = subtotal * promo["value"]
            applied_promotions.append({
                "code": "BULK20", 
                "description": "Bulk order discount",
                "discount_amount": round(discount, 2)
            })
            total_discount += discount
        
        return {
            "applied_promotions": applied_promotions,
            "total_discount": round(total_discount, 2),
            "final_subtotal": round(subtotal - total_discount, 2),
            "available_promotions": list(available_promotions.keys())
        }
    
    def _get_tax_rate(self, category: ProductCategory, country: str) -> float:
        """Get tax rate based on product category and destination."""
        # Simplified tax rates by country
        country_rates = {
            "US": 0.0875,  # Average US sales tax
            "CA": 0.13,    # Canadian HST
            "GB": 0.20,    # UK VAT
            "DE": 0.19,    # German VAT
        }
        
        # Some categories may be tax-exempt in certain jurisdictions
        if category == ProductCategory.REAGENTS and country == "US":
            return 0.0  # Research reagents often tax-exempt
        
        return country_rates.get(country, 0.10)  # 10% default
    
    def _calculate_shipping(self, basket: Basket) -> float:
        """Simplified shipping calculation."""
        # This would integrate with the shipping estimator service
        base_shipping = 15.0
        item_count = sum(item.quantity for item in basket.items)
        return base_shipping + (item_count * 2.0)
    
    def _generate_dynamic_fields(self, basket: Basket, subtotal: float) -> List[DynamicField]:
        """Generate dynamic invoice fields based on transaction characteristics."""
        fields = []
        
        # Service fee based on customer segment
        service_fee_rate = self.service_fees.get(basket.customer.segment, 0.025)
        service_fee = subtotal * service_fee_rate
        
        fields.append(DynamicField(
            field_name="service_fee",
            field_value=service_fee,
            description=f"Service fee ({service_fee_rate*100}%)"
        ))
        
        # Handling charge for fragile items
        has_fragile = any(
            item.product.category in [ProductCategory.INSTRUMENTS, ProductCategory.LAB_EQUIPMENT]
            for item in basket.items
        )
        
        if has_fragile:
            fields.append(DynamicField(
                field_name="handling_charge",
                field_value=25.0,
                description="Special handling for fragile equipment"
            ))
        
        # International processing fee
        if basket.customer.country.upper() != basket.destination_country.upper():
            fields.append(DynamicField(
                field_name="international_processing",
                field_value=35.0,
                description="International processing and documentation"
            ))
        
        # Rush order fee (demo logic)
        fields.append(DynamicField(
            field_name="rush_processing",
            field_value=0.0,
            description="Rush processing (if applicable)"
        ))
        
        return fields
    
    def _apply_promotions(self, basket: Basket, subtotal: float) -> float:
        """Calculate automatic promotion discounts."""
        discount = 0
        
        # Academic discount
        if basket.customer.segment == CustomerSegment.ACADEMIC and subtotal >= 100:
            discount += subtotal * 0.10
        
        # Volume discount
        if subtotal >= 1000:
            discount += subtotal * 0.05
        
        return discount
