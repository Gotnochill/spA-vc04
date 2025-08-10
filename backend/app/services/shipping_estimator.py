import numpy as np
import pandas as pd
from typing import List, Dict, Any
from app.models.schemas import Basket, ShippingEstimate, ProductCategory
from sklearn.ensemble import RandomForestRegressor
import joblib

class ShippingEstimator:
    def __init__(self):
        self.weight_inference_model = None
        self.cost_model = None
        self.load_models()
        
        # Shipping zones and base rates
        self.zone_rates = {
            "domestic": {"base": 8.50, "per_kg": 2.20},
            "international": {"base": 25.00, "per_kg": 4.50},
            "express": {"base": 15.00, "per_kg": 3.80}
        }
        
        # Average weights by category (kg)
        self.category_weights = {
            ProductCategory.REAGENTS: 0.5,
            ProductCategory.CONSUMABLES: 0.2,
            ProductCategory.CHEMICALS: 1.2,
            ProductCategory.LAB_EQUIPMENT: 5.0,
            ProductCategory.INSTRUMENTS: 15.0
        }
    
    def load_models(self):
        """Load pre-trained shipping models."""
        try:
            # Initialize with demo models
            self.weight_inference_model = RandomForestRegressor(n_estimators=50)
            self.cost_model = RandomForestRegressor(n_estimators=50)
        except Exception as e:
            print(f"Error loading shipping models: {e}")
    
    def estimate_cost(self, basket: Basket) -> ShippingEstimate:
        """Estimate shipping costs with weight inference."""
        total_weight = 0
        inferred_items = []
        
        # Calculate total weight, inferring missing weights
        for item in basket.items:
            if item.product.weight_kg:
                item_weight = item.product.weight_kg * item.quantity
            else:
                # Infer weight from category
                inferred_weight = self.category_weights.get(
                    item.product.category, 1.0
                )
                item_weight = inferred_weight * item.quantity
                inferred_items.append(item.product.sku)
            
            total_weight += item_weight
        
        # Determine shipping zone
        is_international = basket.destination_country.upper() != basket.customer.country.upper()
        zone = "international" if is_international else "domestic"
        
        # Calculate base shipping cost
        zone_config = self.zone_rates[zone]
        base_cost = zone_config["base"]
        weight_cost = total_weight * zone_config["per_kg"]
        
        # Additional fees
        handling_fee = 5.0 if total_weight > 10 else 2.5
        fuel_surcharge = (base_cost + weight_cost) * 0.08
        insurance = sum(item.product.base_price * item.quantity for item in basket.items) * 0.01
        
        # International fees
        customs_fee = 15.0 if is_international else 0
        tariff_estimate = 0
        if is_international:
            tariff_estimate = sum(item.product.base_price * item.quantity for item in basket.items) * 0.05
        
        total_cost = base_cost + weight_cost + handling_fee + fuel_surcharge + insurance + customs_fee + tariff_estimate
        
        # Carrier options
        carrier_options = [
            {
                "carrier": "FedEx Ground",
                "service": "Standard",
                "cost": round(total_cost, 2),
                "days": "3-5"
            },
            {
                "carrier": "FedEx Express",
                "service": "Overnight",
                "cost": round(total_cost * 1.8, 2),
                "days": "1"
            },
            {
                "carrier": "UPS Ground",
                "service": "Standard",
                "cost": round(total_cost * 0.95, 2),
                "days": "3-5"
            }
        ]
        
        breakdown = {
            "base_shipping": round(base_cost, 2),
            "weight_charges": round(weight_cost, 2),
            "handling_fee": round(handling_fee, 2),
            "fuel_surcharge": round(fuel_surcharge, 2),
            "insurance": round(insurance, 2),
            "customs_fee": round(customs_fee, 2),
            "tariff_estimate": round(tariff_estimate, 2)
        }
        
        return ShippingEstimate(
            total_cost=round(total_cost, 2),
            breakdown=breakdown,
            estimated_weight=round(total_weight, 2),
            carrier_options=carrier_options
        )
    
    def infer_weights(self, skus: List[str]) -> Dict[str, float]:
        """Infer weights for products with missing weight data."""
        # Demo weight inference - in production, this would use ML models
        # trained on historical shipping data and product characteristics
        inferred_weights = {}
        
        for sku in skus:
            # Simple heuristic based on SKU patterns
            if "reagent" in sku.lower():
                weight = np.random.normal(0.5, 0.2)
            elif "equipment" in sku.lower():
                weight = np.random.normal(5.0, 2.0)
            elif "instrument" in sku.lower():
                weight = np.random.normal(15.0, 5.0)
            else:
                weight = np.random.normal(1.0, 0.5)
            
            inferred_weights[sku] = max(0.1, round(weight, 2))
        
        return inferred_weights
    
    def get_carriers(self) -> List[Dict[str, Any]]:
        """Get available shipping carriers and service levels."""
        return [
            {
                "name": "FedEx",
                "services": ["Ground", "Express Overnight", "2Day", "International"],
                "coverage": "Global"
            },
            {
                "name": "UPS",
                "services": ["Ground", "Next Day Air", "2nd Day Air", "Worldwide Express"],
                "coverage": "Global"
            },
            {
                "name": "DHL",
                "services": ["Express", "Economy", "Parcel"],
                "coverage": "International"
            }
        ]
    
    def optimize_sourcing(self, basket: Basket) -> Dict[str, Any]:
        """Optimize sourcing locations to minimize total shipping costs."""
        # Demo sourcing optimization
        # In production, this would consider supplier locations, inventory,
        # and shipping costs to find optimal fulfillment strategy
        
        suppliers = ["US-East", "US-West", "EU-Germany", "Asia-Singapore"]
        supplier_costs = {}
        
        for supplier in suppliers:
            # Simulate cost calculation for different suppliers
            distance_multiplier = {
                "US-East": 1.0,
                "US-West": 1.2,
                "EU-Germany": 2.5,
                "Asia-Singapore": 3.0
            }
            
            base_estimate = self.estimate_cost(basket)
            adjusted_cost = base_estimate.total_cost * distance_multiplier[supplier]
            
            supplier_costs[supplier] = {
                "total_cost": round(adjusted_cost, 2),
                "delivery_days": round(2 + distance_multiplier[supplier]),
                "available_items": len(basket.items)  # Demo: all items available
            }
        
        optimal_supplier = min(supplier_costs.keys(), 
                             key=lambda x: supplier_costs[x]["total_cost"])
        
        return {
            "recommended_supplier": optimal_supplier,
            "cost_savings": round(
                min(supplier_costs.values(), key=lambda x: x["total_cost"])["total_cost"] -
                max(supplier_costs.values(), key=lambda x: x["total_cost"])["total_cost"], 2
            ),
            "supplier_options": supplier_costs,
            "optimization_factors": [
                "Shipping cost minimization",
                "Delivery time optimization",
                "Inventory availability"
            ]
        }
