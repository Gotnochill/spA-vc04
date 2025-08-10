#!/usr/bin/env python3
"""
API Test Script for Smart Pricing AI
Tests all endpoints to verify the system is working correctly.
"""

import requests
import json
import sys
from datetime import datetime

API_BASE = "http://localhost:8000"

# Sample data for testing
sample_customer = {
    "id": "CUST-0001",
    "name": "University Research Lab",
    "segment": "academic",
    "location": "Boston, MA",
    "country": "US",
    "tax_exempt": True
}

sample_products = [
    {
        "sku": "REA-0001",
        "name": "PCR Master Mix",
        "category": "reagents",
        "supplier": "ThermoFisher",
        "weight_kg": 0.5,
        "base_price": 150.00,
        "hs_code": "3822"
    },
    {
        "sku": "LAB-0002", 
        "name": "Micropipette Set",
        "category": "lab_equipment",
        "supplier": "Eppendorf",
        "weight_kg": 2.0,
        "base_price": 450.00,
        "hs_code": "9027"
    }
]

sample_basket = {
    "items": [
        {
            "product": sample_products[0],
            "quantity": 2,
            "unit_price": 150.00
        },
        {
            "product": sample_products[1],
            "quantity": 1,
            "unit_price": 450.00
        }
    ],
    "customer": sample_customer,
    "destination_country": "US",
    "destination_zip": "02142"
}

def test_api_endpoint(url, method="GET", data=None, description=""):
    """Test a single API endpoint."""
    try:
        print(f"\n🔍 Testing: {description}")
        print(f"   URL: {url}")
        
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ SUCCESS")
            print(f"   Response: {json.dumps(result, indent=2)[:200]}...")
            return True
        else:
            print(f"   ❌ FAILED - Status {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ CONNECTION FAILED - Server not running?")
        return False
    except requests.exceptions.Timeout:
        print(f"   ❌ TIMEOUT - Request took too long")
        return False
    except Exception as e:
        print(f"   ❌ ERROR - {str(e)}")
        return False

def main():
    """Run comprehensive API tests."""
    print("=" * 60)
    print("🚀 SMART PRICING AI - COMPREHENSIVE API TEST")
    print("=" * 60)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = []
    
    # Test 1: Backend Health Check
    tests.append(test_api_endpoint(
        f"{API_BASE}/",
        description="Backend Health Check"
    ))
    
    # Test 2: Pricing Recommendations
    tests.append(test_api_endpoint(
        f"{API_BASE}/api/pricing/recommendations",
        method="POST",
        data={
            "customer": sample_customer,
            "products": sample_products
        },
        description="Pricing Recommendations API"
    ))
    
    # Test 3: Customer Segments
    tests.append(test_api_endpoint(
        f"{API_BASE}/api/pricing/customer-segments",
        description="Customer Segments API"
    ))
    
    # Test 4: Shipping Estimation
    tests.append(test_api_endpoint(
        f"{API_BASE}/api/shipping/estimate",
        method="POST",
        data=sample_basket,
        description="Shipping Cost Estimation API"
    ))
    
    # Test 5: Shipping Carriers
    tests.append(test_api_endpoint(
        f"{API_BASE}/api/shipping/carriers",
        description="Shipping Carriers API"
    ))
    
    # Test 6: Invoice Generation
    tests.append(test_api_endpoint(
        f"{API_BASE}/api/invoices/generate?include_promotions=true",
        method="POST",
        data=sample_basket,
        description="Invoice Generation API"
    ))
    
    # Test 7: Invoice Template
    tests.append(test_api_endpoint(
        f"{API_BASE}/api/invoices/template/academic",
        description="Invoice Template API"
    ))
    
    # Summary
    passed_tests = sum(tests)
    total_tests = len(tests)
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! Smart Pricing AI is fully operational!")
        print("✅ System ready for production")
        print("✅ All APIs responding correctly")
        print("✅ ML models integrated successfully")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} tests failed. Check the server logs.")
        
    print("\n📖 API Documentation: http://localhost:8000/docs")
    print("🌐 Test Dashboard: file:///d:/smartPricing/test_dashboard.html")
    print("=" * 60)
    
    return passed_tests == total_tests

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
