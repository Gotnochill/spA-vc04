#!/usr/bin/env python3
"""
Test the fixed promotional impact calculations
"""

import sys
import os
sys.path.append('backend')

from backend.app.services.advanced_pricing_engine import AdvancedPricingEngine

def test_promotional_impact_fix():
    """Test that promotional impact now shows positive values"""
    print("🧪 Testing Promotional Impact Fix...")
    
    engine = AdvancedPricingEngine()
    impact = engine.model_promotional_impact()
    
    print("✅ Promotional Impact Analysis Results:")
    overall = impact['overall_impact']
    print(f"📈 Revenue Lift: +{overall['revenue_lift']:.1f}%")
    
    discount_range = overall['optimal_discount_range']
    print(f"💰 Optimal Discount Range: {discount_range['min']:.1f}% - {discount_range['max']:.1f}%")
    print(f"📦 Order Size With Discount: {overall['avg_order_size_with_discount']:.1f} units")
    print(f"📦 Order Size Without Discount: {overall['avg_order_size_without_discount']:.1f} units")
    
    print()
    print("✅ Customer Segment Analysis:")
    for key, value in impact.items():
        if '_impact' in key and isinstance(value, dict):
            segment = key.replace('_impact', '')
            if 'quantity_lift' in value and 'recommended_discount' in value:
                print(f"  {segment.title()}: {value['quantity_lift']:.1f}% lift, {value['recommended_discount']:.0f}% discount")
            else:
                print(f"  {segment.title()}: Available in system")
    
    print()
    
    # Validate all values are positive
    assert overall['revenue_lift'] > 0, "Revenue lift should be positive"
    assert discount_range['min'] > 0, "Minimum discount should be positive"
    assert discount_range['max'] > discount_range['min'], "Max discount should be greater than min"
    
    print("🎉 All promotional values are now positive and realistic!")
    print("✅ Fix successful - no more negative promotional effectiveness!")

if __name__ == "__main__":
    test_promotional_impact_fix()
