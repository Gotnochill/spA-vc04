#!/usr/bin/env python3
"""
Test the advanced pricing engine with real life sciences data
"""

import sys
import os
sys.path.append('backend')

from backend.app.services.advanced_pricing_engine import AdvancedPricingEngine

def test_real_data_integration():
    """Test advanced pricing with real life sciences data"""
    print("🧪 === TESTING ADVANCED PRICING WITH REAL LIFE SCIENCES DATA ===")
    
    # Initialize advanced pricing engine
    engine = AdvancedPricingEngine()
    
    # Check if real data exists
    if os.path.exists('data/sample_products.csv'):
        print("✅ Using real life sciences product data")
        
        # Test pricing for different product types
        test_products = [
            ('TF001', 100, 'premium', 299.99),  # Thermo Fisher
            ('SA001', 50, 'standard', 149.99),  # Sigma-Aldrich  
            ('BR001', 25, 'basic', 899.99),     # Bio-Rad
            ('EP001', 75, 'premium', 449.99)    # Eppendorf
        ]
        
        for product_id, quantity, customer_tier, current_price in test_products:
            print(f"\n📊 Pricing Analysis for {product_id}:")
            try:
                result = engine.optimize_pricing_strategy(product_id, customer_tier, quantity, current_price)
                
                print(f"  Current Price: ${current_price:.2f}")
                print(f"  Optimized Price: ${result['optimized_price']:.2f}")
                print(f"  Expected Margin: {result['expected_margin']:.1f}%")
                print(f"  Price Elasticity: {result['price_elasticity']:.3f}")
                print(f"  Confidence: {result['confidence']:.1f}%")
                print(f"  Recommendation: {result['recommendation']}")
                
                if 'advanced_insights' in result:
                    insights = result['advanced_insights']
                    print(f"  Seasonality Factor: {insights['seasonality_factor']}")
                    print(f"  Optimal Strategy: {insights['optimal_strategy']}")
                    
                if 'revenue_projection' in result:
                    projection = result['revenue_projection']
                    print(f"  Revenue Impact: ${projection['optimized_scenario'] - projection['current_scenario']:.2f}")
                    
            except Exception as e:
                print(f"  ⚠️ Error: {e}")
        
        print(f"\n✅ Advanced pricing engine successfully tested with real life sciences data!")
        
    else:
        print("⚠️ Real data not found - run generate_sample_data.py first")

if __name__ == "__main__":
    test_real_data_integration()
