import numpy as np
import pandas as pd
from typing import List, Dict, Any
from app.models.schemas import Customer, Product, PricingRecommendation, CustomerSegment
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
import joblib
import os

class PricingEngine:
    def __init__(self):
        self.models = {}
        self.customer_clusters = None
        self.load_models()
    
    def load_models(self):
        """Load pre-trained pricing models or initialize new ones."""
        model_path = "ml_models"
        try:
            if os.path.exists(f"{model_path}/pricing_model.joblib"):
                self.models['pricing'] = joblib.load(f"{model_path}/pricing_model.joblib")
            else:
                # Initialize with dummy model for demo
                self.models['pricing'] = RandomForestRegressor(n_estimators=100)
        except Exception as e:
            print(f"Error loading models: {e}")
            self.models['pricing'] = RandomForestRegressor(n_estimators=100)
    
    def get_recommendations(self, customer: Customer, products: List[Product]) -> List[PricingRecommendation]:
        """Generate pricing recommendations based on customer segment and product data."""
        recommendations = []
        
        for product in products:
            # Customer segment pricing multipliers
            segment_multipliers = {
                CustomerSegment.ACADEMIC: 0.85,  # Academic discount
                CustomerSegment.BIOTECH_STARTUP: 0.95,  # Small startup discount
                CustomerSegment.PHARMA_ENTERPRISE: 1.15,  # Premium pricing
                CustomerSegment.RESEARCH_INSTITUTE: 0.90  # Research discount
            }
            
            base_price = product.base_price
            multiplier = segment_multipliers.get(customer.segment, 1.0)
            
            # Add category-specific adjustments
            category_adjustments = {
                "reagents": 1.05,  # Higher margin on reagents
                "lab_equipment": 1.10,  # Premium equipment pricing
                "consumables": 0.98,  # Competitive consumables
                "instruments": 1.20,  # High-value instruments
                "chemicals": 1.02   # Standard chemical markup
            }
            
            category_adj = category_adjustments.get(product.category.value, 1.0)
            recommended_price = base_price * multiplier * category_adj
            
            # Calculate confidence and margin improvement
            confidence = 0.85 + (0.1 * np.random.random())  # Demo confidence
            margin_improvement = ((recommended_price - base_price) / base_price) * 100
            
            reasoning = f"Optimized for {customer.segment.value} segment with {product.category.value} category adjustments"
            
            recommendation = PricingRecommendation(
                sku=product.sku,
                recommended_price=round(recommended_price, 2),
                confidence_score=round(confidence, 3),
                margin_improvement=round(margin_improvement, 2),
                reasoning=reasoning
            )
            recommendations.append(recommendation)
        
        return recommendations
    
    def calculate_elasticity(self, sku: str, price_range: List[float]) -> Dict[str, Any]:
        """Calculate price elasticity for demand modeling."""
        # Demo elasticity calculation
        base_demand = 100
        elasticity_data = []
        
        for price in price_range:
            # Simple elastic demand model (higher price = lower demand)
            demand = base_demand * (price_range[0] / price) ** 1.2
            elasticity_data.append({
                "price": price,
                "projected_demand": round(demand, 2),
                "revenue": round(price * demand, 2)
            })
        
        return {
            "sku": sku,
            "elasticity_coefficient": -1.2,  # Demo coefficient
            "price_demand_curve": elasticity_data,
            "optimal_price": max(elasticity_data, key=lambda x: x["revenue"])["price"]
        }
    
    def analyze_margins(self, customer: Customer, products: List[Product]) -> Dict[str, Any]:
        """Analyze current margins and identify optimization opportunities."""
        total_cost = sum(p.base_price for p in products)
        recommendations = self.get_recommendations(customer, products)
        optimized_revenue = sum(r.recommended_price for r in recommendations)
        
        current_margin = 0.25  # Assume 25% current margin
        optimized_margin = (optimized_revenue - total_cost) / optimized_revenue
        
        return {
            "current_margin_pct": round(current_margin * 100, 2),
            "optimized_margin_pct": round(optimized_margin * 100, 2),
            "margin_improvement": round((optimized_margin - current_margin) * 100, 2),
            "revenue_uplift": round(optimized_revenue - (total_cost * 1.25), 2),
            "customer_segment": customer.segment.value,
            "optimization_opportunities": [
                "Price segmentation by customer type",
                "Category-specific markup optimization",
                "Volume-based pricing tiers"
            ]
        }
