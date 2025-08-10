'use client'

import { useState, useEffect } from 'react'
import { TruckIcon, GlobeAltIcon, ScaleIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface Product {
  sku: string
  name: string
  category: string
  supplier: string
  weight_kg: number
  base_price: number
  hs_code: string
}

interface CustomerSegment {
  value: string
  label: string
  description: string
}

interface ShippingRequest {
  productId: string
  customerSegment: string
  category: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  weight?: number
  origin: string
  destination: string
  serviceLevel: string
}

interface ShippingResponse {
  estimatedCost: number
  inferredWeight: number
  recommendedCarrier: string
  deliveryTime: string
  confidence: number
  alternatives: Array<{
    carrier: string
    cost: number
    deliveryTime: string
  }>
}

export default function ShippingPage() {
  const [request, setRequest] = useState<ShippingRequest>({
    productId: '',
    customerSegment: 'academic',
    category: 'reagents',
    dimensions: { length: 0, width: 0, height: 0 },
    weight: undefined,
    origin: 'New York, NY',
    destination: '',
    serviceLevel: 'standard'
  })
  
  const [response, setResponse] = useState<ShippingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  const customerSegmentOptions: CustomerSegment[] = [
    { value: 'academic', label: 'Academic Institution', description: 'Universities and educational institutions' },
    { value: 'biotech_startup', label: 'Biotech Startup', description: 'Small to medium biotech companies' },
    { value: 'pharma_enterprise', label: 'Pharmaceutical Enterprise', description: 'Large pharmaceutical corporations' },
    { value: 'research_institute', label: 'Research Institute', description: 'Government and private research facilities' }
  ]

  const categoryOptions = [
    { value: 'reagents', label: 'Reagents', description: 'Chemical reagents and solutions' },
    { value: 'equipment', label: 'Laboratory Equipment', description: 'Instruments and lab devices' },
    { value: 'consumables', label: 'Consumables', description: 'Disposable lab supplies' },
    { value: 'biologicals', label: 'Biologicals', description: 'Biological samples and cultures' },
    { value: 'hazardous', label: 'Hazardous Materials', description: 'Dangerous goods requiring special handling' }
  ]

  const serviceLevelOptions = [
    { value: 'standard', label: 'Standard', description: 'Regular shipping, 3-5 business days' },
    { value: 'expedited', label: 'Expedited', description: 'Faster delivery, 2-3 business days' },
    { value: 'overnight', label: 'Overnight', description: 'Next business day delivery' },
    { value: 'ground', label: 'Ground', description: 'Economical ground shipping, 5-7 days' }
  ]

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
          }
        ])
      }
      setLoadingProducts(false)
    }
    
    fetchProducts()
  }, [])

  // Custom dropdown component
  const CustomDropdown = ({ 
    options, 
    value, 
    onChange, 
    label, 
    placeholder = "Select option" 
  }: {
    options: any[]
    value: string
    onChange: (value: string) => void
    label: string
    placeholder?: string
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectedOption = options.find(opt => opt.value === value)

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="glass-card w-full px-4 py-3 text-left bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                {selectedOption && selectedOption.description && (
                  <span className="block text-xs text-gray-500">{selectedOption.description}</span>
                )}
              </div>
              <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="block text-sm font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="block text-xs text-gray-500">{option.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Product dropdown component
  const ProductDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const selectedProduct = products.find(p => p.sku === request.productId)

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Product Selection
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="glass-card w-full px-4 py-3 text-left bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            disabled={loadingProducts}
          >
            <div className="flex items-center justify-between">
              <div>
                {selectedProduct ? (
                  <>
                    <span className="block text-sm font-medium text-gray-900">
                      {selectedProduct.sku} - {selectedProduct.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {selectedProduct.category.replace('_', ' ')} • {selectedProduct.supplier}
                    </span>
                  </>
                ) : (
                  <span className="block text-sm text-gray-500">
                    {loadingProducts ? 'Loading products...' : 'Select a product'}
                  </span>
                )}
              </div>
              <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {isOpen && !loadingProducts && (
            <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-h-60 overflow-auto">
              {products.map((product) => (
                <button
                  key={product.sku}
                  type="button"
                  onClick={() => {
                    setRequest(prev => ({ 
                      ...prev, 
                      productId: product.sku,
                      category: product.category,
                      weight: product.weight_kg * 2.20462 // Convert kg to lbs
                    }))
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="block text-sm font-medium text-gray-900">
                    {product.sku} - {product.name}
                  </div>
                  <div className="block text-xs text-gray-500">
                    {product.category.replace('_', ' ')} • {product.supplier} • ${product.base_price}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleEstimate = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/shipping/estimate', {
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
        // Fallback demo data
        const volume = request.dimensions.length * request.dimensions.width * request.dimensions.height
        const estimatedWeight = request.weight || Math.max(0.5, volume * 0.0001)
        setResponse({
          estimatedCost: 45.99 + (estimatedWeight * 2.5),
          inferredWeight: estimatedWeight,
          recommendedCarrier: 'FedEx Express',
          deliveryTime: '2-3 business days',
          confidence: 87.5,
          alternatives: [
            { carrier: 'UPS Next Day', cost: 89.99, deliveryTime: '1 business day' },
            { carrier: 'DHL Express', cost: 52.50, deliveryTime: '2 business days' },
            { carrier: 'USPS Priority', cost: 28.75, deliveryTime: '3-5 business days' }
          ]
        })
      }
    } catch (error) {
      // Demo data for offline mode
      const volume = request.dimensions.length * request.dimensions.width * request.dimensions.height
      const estimatedWeight = request.weight || Math.max(0.5, volume * 0.0001)
      setResponse({
        estimatedCost: 45.99 + (estimatedWeight * 2.5),
        inferredWeight: estimatedWeight,
        recommendedCarrier: 'FedEx Express',
        deliveryTime: '2-3 business days',
        confidence: 87.5,
        alternatives: [
          { carrier: 'UPS Next Day', cost: 89.99, deliveryTime: '1 business day' },
          { carrier: 'DHL Express', cost: 52.50, deliveryTime: '2 business days' },
          { carrier: 'USPS Priority', cost: 28.75, deliveryTime: '3-5 business days' }
        ]
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Shipping Cost Estimator</h1>
              <p className="text-gray-600">Intelligent weight inference and multi-carrier optimization</p>
            </div>
          </div>
          
          <div className="glass-card p-4 floating-element">
            <div className="flex items-center space-x-3">
              <div className="status-indicator success"></div>
              <span className="text-sm font-medium text-gray-700">AI Weight Inference</span>
              <span className="text-xs text-gray-500">• Smart carrier optimization active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Details</h2>
            
            <div className="space-y-6">
              <ProductDropdown />

              <CustomDropdown
                options={customerSegmentOptions}
                value={request.customerSegment}
                onChange={(value) => setRequest(prev => ({ ...prev, customerSegment: value }))}
                label="Customer Segment"
                placeholder="Select customer type"
              />

              <CustomDropdown
                options={categoryOptions}
                value={request.category}
                onChange={(value) => setRequest(prev => ({ ...prev, category: value }))}
                label="Product Category"
                placeholder="Select product type"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (inches)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={request.dimensions.length}
                    onChange={(e) => setRequest(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, length: parseFloat(e.target.value) || 0 }
                    }))}
                    className="glass-card px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    placeholder="Length"
                    min="0"
                    step="0.1"
                  />
                  <input
                    type="number"
                    value={request.dimensions.width}
                    onChange={(e) => setRequest(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, width: parseFloat(e.target.value) || 0 }
                    }))}
                    className="glass-card px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    placeholder="Width"
                    min="0"
                    step="0.1"
                  />
                  <input
                    type="number"
                    value={request.dimensions.height}
                    onChange={(e) => setRequest(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, height: parseFloat(e.target.value) || 0 }
                    }))}
                    className="glass-card px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    placeholder="Height"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs) - Optional
                </label>
                <input
                  type="number"
                  value={request.weight || ''}
                  onChange={(e) => setRequest(prev => ({ 
                    ...prev, 
                    weight: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  className="glass-card w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  placeholder="Leave empty for AI weight inference"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">If not provided, weight will be inferred from dimensions and category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  value={request.origin}
                  onChange={(e) => setRequest(prev => ({ ...prev, origin: e.target.value }))}
                  className="glass-card w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={request.destination}
                  onChange={(e) => setRequest(prev => ({ ...prev, destination: e.target.value }))}
                  className="glass-card w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  placeholder="e.g., Los Angeles, CA"
                />
              </div>

              <CustomDropdown
                options={serviceLevelOptions}
                value={request.serviceLevel}
                onChange={(value) => setRequest(prev => ({ ...prev, serviceLevel: value }))}
                label="Service Level"
                placeholder="Select delivery speed"
              />

              <button
                onClick={handleEstimate}
                disabled={loading || !request.productId || !request.destination}
                className="modern-btn bg-gradient-to-r from-green-500 to-emerald-600 text-white w-full py-4 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-3"></div>
                    Calculating...
                  </div>
                ) : (
                  'Estimate Shipping Cost'
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Estimate</h2>
            
            {response ? (
              <div className="space-y-6">
                {/* Primary Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="metric-card">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <CurrencyDollarIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Estimated Cost</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">${response.estimatedCost.toFixed(2)}</p>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ScaleIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Inferred Weight</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{response.inferredWeight.toFixed(1)} lbs</p>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <TruckIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Recommended Carrier</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{response.recommendedCarrier}</p>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Delivery Time</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{response.deliveryTime}</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="glass-card p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Confidence Score</h3>
                      <p className="text-sm text-gray-600">AI prediction accuracy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{response.confidence.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">High accuracy</p>
                    </div>
                  </div>
                </div>

                {/* Alternatives */}
                <div className="matte-card p-6 bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-4">Alternative Carriers</h3>
                  <div className="space-y-3">
                    {response.alternatives.map((alt, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">{alt.carrier}</p>
                          <p className="text-sm text-slate-600">{alt.deliveryTime}</p>
                        </div>
                        <p className="font-bold text-slate-900">${alt.cost.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="matte-btn matte-btn-primary flex-1">
                    Book Shipment
                  </button>
                  <button className="matte-btn matte-btn-secondary flex-1">
                    Compare All Carriers
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-2">Ready for Shipping Estimate</p>
                <p className="text-sm text-slate-400">Enter product details and destination to get AI-powered shipping cost estimates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
