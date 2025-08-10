"""
Sample data generator for Smart Pricing AI system.
Creates realistic life sciences e-commerce data for training and testing.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

def generate_sample_products():
    """Generate sample life sciences products."""
    categories = ['reagents', 'lab_equipment', 'consumables', 'instruments', 'chemicals']
    suppliers = ['ThermoFisher', 'Sigma-Aldrich', 'Bio-Rad', 'Agilent', 'Merck']
    
    products = []
    for i in range(1000):
        category = np.random.choice(categories)
        supplier = np.random.choice(suppliers)
        
        # Generate realistic weights by category
        if category == 'reagents':
            weight = np.random.uniform(0.1, 2.0)
            price = np.random.uniform(50, 500)
        elif category == 'lab_equipment':
            weight = np.random.uniform(2.0, 20.0)
            price = np.random.uniform(200, 2000)
        elif category == 'consumables':
            weight = np.random.uniform(0.05, 1.0)
            price = np.random.uniform(10, 200)
        elif category == 'instruments':
            weight = np.random.uniform(10.0, 50.0)
            price = np.random.uniform(1000, 25000)
        else:  # chemicals
            weight = np.random.uniform(0.5, 5.0)
            price = np.random.uniform(30, 800)
        
        product = {
            'sku': f'{category.upper()[:3]}-{i:04d}',
            'name': f'{category.title()} Product {i}',
            'category': category,
            'supplier': supplier,
            'weight_kg': round(weight, 2),
            'base_price': round(price, 2),
            'hs_code': np.random.choice(['3822', '9027', '3926', '7020'])
        }
        products.append(product)
    
    return pd.DataFrame(products)

def generate_sample_customers():
    """Generate sample customer data."""
    segments = ['academic', 'biotech_startup', 'pharma_enterprise', 'research_institute']
    countries = ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU']
    
    customers = []
    for i in range(200):
        segment = np.random.choice(segments)
        country = np.random.choice(countries)
        
        customer = {
            'customer_id': f'CUST-{i:04d}',
            'name': f'{segment.replace("_", " ").title()} {i}',
            'segment': segment,
            'country': country,
            'tax_exempt': segment == 'academic' and np.random.random() < 0.3
        }
        customers.append(customer)
    
    return pd.DataFrame(customers)

def generate_sample_transactions():
    """Generate historical transaction data."""
    products_df = generate_sample_products()
    customers_df = generate_sample_customers()
    
    transactions = []
    start_date = datetime.now() - timedelta(days=365)
    
    for i in range(5000):
        # Random date in the past year
        days_ago = np.random.randint(0, 365)
        transaction_date = start_date + timedelta(days=days_ago)
        
        # Select random customer and products
        customer = customers_df.sample(1).iloc[0]
        num_items = np.random.randint(1, 8)
        selected_products = products_df.sample(num_items)
        
        # Calculate pricing based on customer segment
        segment_multipliers = {
            'academic': 0.85,
            'biotech_startup': 0.95,
            'pharma_enterprise': 1.15,
            'research_institute': 0.90
        }
        
        multiplier = segment_multipliers[customer['segment']]
        
        for _, product in selected_products.iterrows():
            quantity = np.random.randint(1, 20)
            unit_price = product['base_price'] * multiplier * np.random.uniform(0.9, 1.1)
            
            transaction = {
                'transaction_id': f'TXN-{i:06d}',
                'date': transaction_date.isoformat(),
                'customer_id': customer['customer_id'],
                'customer_segment': customer['segment'],
                'sku': product['sku'],
                'product_category': product['category'],
                'quantity': quantity,
                'unit_price': round(unit_price, 2),
                'total_amount': round(unit_price * quantity, 2),
                'shipping_cost': round(np.random.uniform(10, 100), 2)
            }
            transactions.append(transaction)
    
    return pd.DataFrame(transactions)

if __name__ == "__main__":
    print("Generating sample data...")
    
    # Generate datasets
    products = generate_sample_products()
    customers = generate_sample_customers()
    transactions = generate_sample_transactions()
    
    # Save to CSV files
    products.to_csv('data/sample_products.csv', index=False)
    customers.to_csv('data/sample_customers.csv', index=False)
    transactions.to_csv('data/sample_transactions.csv', index=False)
    
    print(f"Generated {len(products)} products")
    print(f"Generated {len(customers)} customers")
    print(f"Generated {len(transactions)} transactions")
    print("Sample data saved to data/ directory")
