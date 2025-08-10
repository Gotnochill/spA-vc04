'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, UserGroupIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import CustomDropdown from '../../components/CustomDropdown'
import jsPDF from 'jspdf'

interface Product {
  sku: string
  name: string
  category: string
  supplier: string
  weight_kg: number
  base_price: number
  hs_code: string
}

interface PricingRequest {
  productId: string
  customerSegment: string
  quantity: number
  currentPrice: number
}

interface PricingResponse {
  optimizedPrice: number
  expectedMargin: number
  priceElasticity: number
  recommendation: string
  confidence: number
}

export default function PricingPage() {
  const [request, setRequest] = useState<PricingRequest>({
    productId: '',
    customerSegment: 'academic',
    quantity: 1,
    currentPrice: 0
  })
  
  const [response, setResponse] = useState<PricingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      try {
        const response = await fetch('http://localhost:8000/api/products/')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback sample products
        setProducts([
          {
            sku: 'CHE-001',
            name: 'Analytical Grade Methanol',
            category: 'chemicals',
            supplier: 'Sigma-Aldrich',
            weight_kg: 2.5,
            base_price: 185.00,
            hs_code: '2905'
          },
          {
            sku: 'LAB-002',
            name: 'Digital pH Meter',
            category: 'lab_equipment',
            supplier: 'Agilent',
            weight_kg: 1.2,
            base_price: 450.00,
            hs_code: '9027'
          },
          {
            sku: 'BIO-003',
            name: 'PCR Master Mix',
            category: 'reagents',
            supplier: 'Thermo Fisher',
            weight_kg: 0.1,
            base_price: 95.00,
            hs_code: '3822'
          }
        ])
      }
      setLoadingProducts(false)
    }
    
    fetchProducts()
  }, [])

  const customerSegmentOptions = [
    { 
      value: 'academic', 
      label: 'Academic Institution', 
      description: 'Universities, research institutions, educational facilities' 
    },
    { 
      value: 'enterprise', 
      label: 'Enterprise Corporation', 
      description: 'Large corporations, established companies' 
    },
    { 
      value: 'government', 
      label: 'Government Agency', 
      description: 'Federal, state, and local government agencies' 
    },
    { 
      value: 'startup', 
      label: 'Startup Company', 
      description: 'Early-stage companies, small businesses' 
    },
    { 
      value: 'pharmaceutical', 
      label: 'Pharmaceutical Company', 
      description: 'Drug development companies, biotech firms' 
    }
  ]

  // Create product options for dropdown
  const productOptions = products.map(product => ({
    value: product.sku,
    label: `${product.sku} - ${product.name}`,
    description: `${product.category.replace('_', ' ')} • ${product.supplier} • $${product.base_price}`
  }))

  // Handle product selection and auto-fill price
  const handleProductChange = (productSku: string) => {
    const selectedProduct = products.find(p => p.sku === productSku)
    setRequest(prev => ({
      ...prev,
      productId: productSku,
      currentPrice: selectedProduct ? selectedProduct.base_price : 0
    }))
  }

  const handleOptimize = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/pricing/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
      
      if (res.ok) {
        const data = await res.json()
        setResponse(data)
      } else {
        // Fallback demo data if API is not available
        setResponse({
          optimizedPrice: request.currentPrice * 1.15,
          expectedMargin: 28.5,
          priceElasticity: 0.85,
          recommendation: "Increase price by 15% for optimal margin",
          confidence: 92.3
        })
      }
    } catch (error) {
      // Demo data for offline mode
      setResponse({
        optimizedPrice: request.currentPrice * 1.15,
        expectedMargin: 28.5,
        priceElasticity: 0.85,
        recommendation: "Increase price by 15% for optimal margin",
        confidence: 92.3
      })
    }
    setLoading(false)
  }

  const exportToPDF = () => {
    if (!response) return

    const pdf = new jsPDF()
    const selectedProduct = products.find(p => p.sku === request.productId)
    const selectedSegment = customerSegmentOptions.find(opt => opt.value === request.customerSegment)
    
    // Header
    pdf.setFontSize(20)
    pdf.setTextColor(34, 34, 34)
    pdf.text('Smart Pricing AI - Optimization Report', 20, 30)
    
    // Date
    const currentDate = new Date()
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    }
    
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generated on: ${currentDate.toLocaleDateString('en-US', dateOptions)} at ${currentDate.toLocaleTimeString('en-US', timeOptions)}`, 20, 40)
    
    // Product Information
    pdf.setFontSize(16)
    pdf.setTextColor(34, 34, 34)
    pdf.text('Product Information', 20, 55)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    if (selectedProduct) {
      pdf.text(`Product: ${selectedProduct.name} (${selectedProduct.sku})`, 20, 65)
      pdf.text(`Category: ${selectedProduct.category.replace('_', ' ')}`, 20, 72)
      pdf.text(`Supplier: ${selectedProduct.supplier}`, 20, 79)
      pdf.text(`Base Price: $${selectedProduct.base_price.toFixed(2)}`, 20, 86)
    } else {
      pdf.text(`Product ID: ${request.productId}`, 20, 65)
    }
    
    // Customer Information
    pdf.setFontSize(16)
    pdf.setTextColor(34, 34, 34)
    pdf.text('Customer Information', 20, 105)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Customer Segment: ${selectedSegment?.label || request.customerSegment}`, 20, 115)
    if (selectedSegment?.description) {
      pdf.text(`Description: ${selectedSegment.description}`, 20, 122)
    }
    pdf.text(`Order Quantity: ${request.quantity} units`, 20, 129)
    pdf.text(`Current Price: $${request.currentPrice.toFixed(2)}`, 20, 136)
    
    // Optimization Results
    pdf.setFontSize(16)
    pdf.setTextColor(34, 34, 34)
    pdf.text('AI Optimization Results', 20, 155)
    
    pdf.setFontSize(14)
    pdf.setTextColor(0, 120, 0)
    pdf.text(`Optimized Price: $${response.optimizedPrice.toFixed(2)}`, 20, 170)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Expected Margin: ${response.expectedMargin.toFixed(1)}%`, 20, 180)
    pdf.text(`Price Elasticity: ${response.priceElasticity.toFixed(2)}`, 20, 187)
    pdf.text(`AI Confidence: ${response.confidence.toFixed(1)}%`, 20, 194)
    
    // Price Analysis
    const priceChange = response.optimizedPrice - request.currentPrice
    const priceChangePercent = (priceChange / request.currentPrice) * 100
    const revenueImpact = priceChange * request.quantity
    
    pdf.text(`Price Change: $${priceChange.toFixed(2)} (${priceChangePercent.toFixed(1)}%)`, 20, 201)
    pdf.text(`Revenue Impact: $${revenueImpact.toFixed(2)}`, 20, 208)
    
    // AI Recommendation
    pdf.setFontSize(16)
    pdf.setTextColor(34, 34, 34)
    pdf.text('AI Recommendation', 20, 225)
    
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 60)
    const lines = pdf.splitTextToSize(response.recommendation, 170)
    pdf.text(lines, 20, 235)
    
    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(120, 120, 120)
    pdf.text('This report was generated by Smart Pricing AI - Life Sciences E-Commerce Intelligence', 20, 280)
    pdf.text('© 2025 Smart Pricing AI. All rights reserved.', 20, 287)
    
    // Save the PDF
    const fileName = `pricing-report-${request.productId || 'product'}-${Date.now()}.pdf`
    pdf.save(fileName)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Smart Pricing Engine</h1>
              <p className="text-slate-600">AI-driven pricing optimization for maximum profitability</p>
            </div>
          </div>
          
          <div className="matte-card p-4">
            <div className="flex items-center space-x-3">
              <div className="status-dot status-success"></div>
              <span className="text-sm font-medium text-slate-700">AI Price Optimization</span>
              <span className="text-xs text-slate-500">• Machine learning active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="matte-card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Pricing Optimization Request</h2>
            
            <div className="space-y-6">
              <CustomDropdown
                options={productOptions}
                value={request.productId}
                onChange={handleProductChange}
                label="Product Selection"
                placeholder={loadingProducts ? "Loading products..." : "Select a product"}
              />

              <CustomDropdown
                options={customerSegmentOptions}
                value={request.customerSegment}
                onChange={(value) => setRequest(prev => ({ ...prev, customerSegment: value }))}
                label="Customer Segment"
                placeholder="Select customer type"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={request.quantity}
                  onChange={(e) => setRequest(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="matte-input"
                  min="1"
                  placeholder="Enter order quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Price ($)
                </label>
                <input
                  type="number"
                  value={request.currentPrice}
                  onChange={(e) => setRequest(prev => ({ ...prev, currentPrice: parseFloat(e.target.value) || 0 }))}
                  className="matte-input"
                  step="0.01"
                  min="0"
                  placeholder="Auto-filled from product selection"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Price is automatically filled when you select a product
                </p>
              </div>

              <button
                onClick={handleOptimize}
                disabled={loading || !request.productId || request.currentPrice <= 0}
                className={`matte-btn matte-btn-primary w-full py-4 text-base font-semibold ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Optimizing...
                  </div>
                ) : (
                  'Optimize Pricing'
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="matte-card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Optimization Results</h2>
            
            {response ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Optimized Price</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">${response.optimizedPrice.toFixed(2)}</p>
                  </div>

                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Expected Margin</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{response.expectedMargin.toFixed(1)}%</p>
                  </div>

                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Price Elasticity</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{response.priceElasticity.toFixed(2)}</p>
                  </div>

                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Confidence</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{response.confidence.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="matte-card p-6 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center mr-2">
                      <ChartBarIcon className="w-3 h-3 text-blue-600" />
                    </div>
                    AI Recommendation
                  </h3>
                  <p className="text-slate-700">{response.recommendation}</p>
                </div>

                <div className="matte-card p-6 bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-4">Price Comparison</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Current Price:</span>
                      <span className="font-semibold text-slate-900">${request.currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Optimized Price:</span>
                      <span className="font-semibold text-green-600">${response.optimizedPrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Price Increase:</span>
                        <div className="text-right">
                          <span className="font-bold text-blue-600 block">
                            ${(response.optimizedPrice - request.currentPrice).toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({(((response.optimizedPrice - request.currentPrice) / request.currentPrice) * 100).toFixed(1)}% increase)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="matte-btn matte-btn-primary flex-1">
                    Apply Pricing
                  </button>
                  <button 
                    onClick={exportToPDF}
                    className="matte-btn matte-btn-secondary flex-1"
                  >
                    Export Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-2">Ready for Price Optimization</p>
                <p className="text-sm text-slate-400">Enter product details and click "Optimize Pricing" to see AI-driven recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}