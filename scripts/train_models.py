"""
ML Model Training Script for Smart Pricing AI
Trains pricing, shipping, and customer segmentation models
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, classification_report
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

def train_pricing_model():
    """Train pricing optimization model."""
    print("Training pricing model...")
    
    # Load transaction data
    if not os.path.exists('data/sample_transactions.csv'):
        print("No transaction data found. Run generate_sample_data.py first.")
        return
    
    df = pd.read_csv('data/sample_transactions.csv')
    
    # Feature engineering
    le_segment = LabelEncoder()
    le_category = LabelEncoder()
    
    df['segment_encoded'] = le_segment.fit_transform(df['customer_segment'])
    df['category_encoded'] = le_category.fit_transform(df['product_category'])
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day_of_year'] = df['date'].dt.dayofyear
    
    # Features for pricing model
    features = ['segment_encoded', 'category_encoded', 'quantity', 'month', 'day_of_year']
    X = df[features]
    y = df['unit_price']
    
    # Train model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Pricing model MAE: ${mae:.2f}")
    
    # Save model and encoders
    os.makedirs('ml_models', exist_ok=True)
    joblib.dump(model, 'ml_models/pricing_model.joblib')
    joblib.dump(le_segment, 'ml_models/segment_encoder.joblib')
    joblib.dump(le_category, 'ml_models/category_encoder.joblib')
    
    return model

def train_shipping_model():
    """Train shipping cost prediction model."""
    print("Training shipping model...")
    
    # Load product data for weight inference
    if not os.path.exists('data/sample_products.csv'):
        print("No product data found. Run generate_sample_data.py first.")
        return
    
    products_df = pd.read_csv('data/sample_products.csv')
    
    # Feature engineering for weight prediction
    le_category = LabelEncoder()
    le_supplier = LabelEncoder()
    
    products_df['category_encoded'] = le_category.fit_transform(products_df['category'])
    products_df['supplier_encoded'] = le_supplier.fit_transform(products_df['supplier'])
    
    # Features: category, supplier, price (to infer weight)
    features = ['category_encoded', 'supplier_encoded', 'base_price']
    X = products_df[features]
    y = products_df['weight_kg']
    
    # Train model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Weight inference model MAE: {mae:.2f} kg")
    
    # Save model
    joblib.dump(model, 'ml_models/weight_inference_model.joblib')
    joblib.dump(le_category, 'ml_models/shipping_category_encoder.joblib')
    joblib.dump(le_supplier, 'ml_models/supplier_encoder.joblib')
    
    return model

def train_customer_segmentation():
    """Train customer segmentation model."""
    print("Training customer segmentation model...")
    
    # Load transaction data for customer behavior analysis
    if not os.path.exists('data/sample_transactions.csv'):
        print("No transaction data found. Run generate_sample_data.py first.")
        return
    
    df = pd.read_csv('data/sample_transactions.csv')
    
    # Aggregate customer behavior features
    customer_features = df.groupby('customer_id').agg({
        'total_amount': ['sum', 'mean', 'count'],
        'quantity': ['sum', 'mean'],
        'shipping_cost': ['sum', 'mean'],
        'product_category': lambda x: x.nunique()
    }).reset_index()
    
    # Flatten column names
    customer_features.columns = [
        'customer_id', 'total_spent', 'avg_order_value', 'order_count',
        'total_quantity', 'avg_quantity', 'total_shipping', 'avg_shipping',
        'category_diversity'
    ]
    
    # Features for clustering
    feature_cols = ['total_spent', 'avg_order_value', 'order_count', 'category_diversity']
    X = customer_features[feature_cols]
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # K-means clustering
    kmeans = KMeans(n_clusters=4, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)
    
    customer_features['cluster'] = clusters
    
    # Save model
    joblib.dump(kmeans, 'ml_models/customer_segmentation_model.joblib')
    joblib.dump(scaler, 'ml_models/customer_scaler.joblib')
    
    # Print cluster characteristics
    print("Customer Clusters:")
    for i in range(4):
        cluster_data = customer_features[customer_features['cluster'] == i]
        print(f"Cluster {i}: {len(cluster_data)} customers")
        print(f"  Avg spent: ${cluster_data['total_spent'].mean():.2f}")
        print(f"  Avg orders: {cluster_data['order_count'].mean():.1f}")
        print(f"  Avg order value: ${cluster_data['avg_order_value'].mean():.2f}")
    
    return kmeans, scaler

def main():
    """Train all models."""
    print("Starting ML model training...")
    
    # Train models
    pricing_model = train_pricing_model()
    shipping_model = train_shipping_model()
    segmentation_model = train_customer_segmentation()
    
    print("\nAll models trained and saved to ml_models/ directory")
    print("Models ready for production use!")

if __name__ == "__main__":
    main()
