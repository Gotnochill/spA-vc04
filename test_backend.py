#!/usr/bin/env python3
import requests
import time

def test_backend():
    base_url = "http://127.0.0.1:8000"
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Root endpoint error: {e}")
    
    # Test pricing endpoint
    try:
        response = requests.post(f"{base_url}/api/pricing/optimize", json={
            "product_id": "TEST-001",
            "current_price": 100.0,
            "customer_segment": "premium",
            "quantity": 1
        })
        print(f"Pricing endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Pricing response: {response.json()}")
    except Exception as e:
        print(f"Pricing endpoint error: {e}")
    
    # Test shipping endpoint
    try:
        response = requests.post(f"{base_url}/api/shipping/estimate", json={
            "product_category": "Reagents",
            "origin": "New York, NY",
            "destination": "Boston, MA",
            "quantity": 1
        })
        print(f"Shipping endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Shipping response: {response.json()}")
    except Exception as e:
        print(f"Shipping endpoint error: {e}")

if __name__ == "__main__":
    test_backend()
