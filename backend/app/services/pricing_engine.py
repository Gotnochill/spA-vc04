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
    
    def optimize_price(self, product_id: str, customer_segment: str, quantity: int, current_price: float) -> Dict[str, Any]:
        """
        Optimize pricing for a specific product and customer segment.
        """
        # Customer segment pricing multipliers
        segment_multipliers = {
            "academic": 0.85,  # Academic discount
            "enterprise": 1.15,  # Enterprise premium
            "government": 0.90,  # Government discount
            "startup": 0.95,   # Startup discount
            "pharmaceutical": 1.20  # Pharma premium
        }
        
        # Volume discounts based on quantity
        volume_multipliers = {
            1: 1.0,      # Single item
            2: 0.98,     # 2% discount for 2+
            5: 0.95,     # 5% discount for 5+
            10: 0.92,    # 8% discount for 10+
            25: 0.88,    # 12% discount for 25+
        }
        
        # Get the appropriate multipliers
        segment_mult = segment_multipliers.get(customer_segment, 1.0)
        
        # Find the right volume multiplier
        volume_mult = 1.0
        for qty_threshold in sorted(volume_multipliers.keys(), reverse=True):
            if quantity >= qty_threshold:
                volume_mult = volume_multipliers[qty_threshold]
                break
        
        # Calculate optimized price
        base_optimization = current_price * segment_mult * volume_mult
        
        # Add AI-driven adjustments (simulated with some randomness for demo)
        market_factor = np.random.uniform(0.95, 1.05)  # Market conditions
        competition_factor = np.random.uniform(0.98, 1.02)  # Competitive pricing
        
        optimized_price = base_optimization * market_factor * competition_factor
        
        # Calculate metrics
        price_change_pct = ((optimized_price - current_price) / current_price) * 100
        expected_margin = 25.0 + (price_change_pct * 0.5)  # Margin improves with price
        price_elasticity = abs(price_change_pct) / 10.0  # Simple elasticity model
        confidence = 85.0 + np.random.uniform(0, 15)  # 85-100% confidence
        
        # Generate recommendation text
        if optimized_price > current_price:
            action = "increase"
            direction = "higher"
        else:
            action = "decrease"
            direction = "lower"
        
        recommendation = f"Recommend {action} price by {abs(price_change_pct):.1f}% for {customer_segment} segment. " \
                        f"Market analysis suggests {direction} pricing will optimize revenue while maintaining competitiveness."
        
        return {
            "optimized_price": round(optimized_price, 2),
            "expected_margin": round(expected_margin, 1),
            "price_elasticity": round(price_elasticity, 2),
            "recommendation": recommendation,
            "confidence": round(confidence, 1)
        }
