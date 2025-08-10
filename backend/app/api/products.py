from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pandas as pd
import os

router = APIRouter()

@router.get("/")
async def get_products():
    """
    Get all products with their details for dropdown selection.
    """
    try:
        # Load sample products data
        products_file = "data/sample_products.csv"
        if os.path.exists(products_file):
            df = pd.read_csv(products_file)
            
            # Convert to list of dictionaries for API response
            products = []
            for _, row in df.iterrows():
                products.append({
                    "sku": row["sku"],
                    "name": row["name"],
                    "category": row["category"],
                    "supplier": row["supplier"],
                    "weight_kg": row["weight_kg"],
                    "base_price": row["base_price"],
                    "hs_code": row["hs_code"]
                })
            
            return products
        else:
            # Return sample data if CSV not found
            return [
                {
                    "sku": "CHE-001",
                    "name": "Analytical Grade Methanol",
                    "category": "chemicals",
                    "supplier": "Sigma-Aldrich",
                    "weight_kg": 2.5,
                    "base_price": 185.00,
                    "hs_code": "2905"
                },
                {
                    "sku": "LAB-002", 
                    "name": "Digital pH Meter",
                    "category": "lab_equipment",
                    "supplier": "Agilent",
                    "weight_kg": 1.2,
                    "base_price": 450.00,
                    "hs_code": "9027"
                },
                {
                    "sku": "REA-003",
                    "name": "PCR Master Mix Kit",
                    "category": "reagents", 
                    "supplier": "ThermoFisher",
                    "weight_kg": 0.8,
                    "base_price": 320.00,
                    "hs_code": "3822"
                }
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@router.get("/categories")
async def get_product_categories():
    """
    Get all available product categories.
    """
    try:
        categories = [
            {
                "value": "chemicals",
                "label": "Chemicals",
                "description": "Research and analytical grade chemicals"
            },
            {
                "value": "lab_equipment", 
                "label": "Laboratory Equipment",
                "description": "Scientific instruments and devices"
            },
            {
                "value": "reagents",
                "label": "Reagents & Kits", 
                "description": "Biological reagents and assay kits"
            },
            {
                "value": "consumables",
                "label": "Consumables",
                "description": "Disposable laboratory supplies"
            },
            {
                "value": "instruments",
                "label": "Analytical Instruments",
                "description": "High-end analytical equipment"
            }
        ]
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@router.get("/search")
async def search_products(q: str = "", category: str = "", limit: int = 50):
    """
    Search products by name, SKU, or category.
    """
    try:
        # Load sample products data
        products_file = "data/sample_products.csv"
        if os.path.exists(products_file):
            df = pd.read_csv(products_file)
            
            # Apply filters
            if q:
                df = df[df['name'].str.contains(q, case=False, na=False) | 
                       df['sku'].str.contains(q, case=False, na=False)]
            
            if category:
                df = df[df['category'] == category]
            
            # Limit results
            df = df.head(limit)
            
            # Convert to list of dictionaries
            products = []
            for _, row in df.iterrows():
                products.append({
                    "sku": row["sku"],
                    "name": row["name"],
                    "category": row["category"],
                    "supplier": row["supplier"],
                    "weight_kg": row["weight_kg"],
                    "base_price": row["base_price"],
                    "hs_code": row["hs_code"]
                })
            
            return products
        else:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching products: {str(e)}")
