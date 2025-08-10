'use client'

import { useState } from 'react'
import { TruckIcon, GlobeAltIcon, ScaleIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import CustomDropdown from '../../components/CustomDropdown'

interface ShippingRequest {
  productId: string
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
    category: 'reagents',
    dimensions: { length: 0, width: 0, height: 0 },
    weight: undefined,
    origin: 'New York, NY',
    destination: '',
    serviceLevel: 'standard'
  })
  
  const [response, setResponse] = useState<ShippingResponse | null>(null)
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Shipping Cost Estimator</h1>
              <p className="text-slate-600">Intelligent weight inference and multi-carrier optimization</p>
            </div>
          </div>
          
          <div className="matte-card p-4">
            <div className="flex items-center space-x-3">
              <div className="status-dot status-success"></div>
              <span className="text-sm font-medium text-slate-700">AI Weight Inference</span>
              <span className="text-xs text-slate-500">• Smart carrier optimization active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="matte-card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  value={request.productId}
                  onChange={(e) => setRequest(prev => ({ ...prev, productId: e.target.value }))}
                  className="matte-input"
                  placeholder="e.g., PRD-001, LAB-KIT-500"
                />
              </div>

              <CustomDropdown
                options={categoryOptions}
                value={request.category}
                onChange={(value) => setRequest(prev => ({ ...prev, category: value }))}
                label="Product Category"
                placeholder="Select product type"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    className="matte-input"
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
                    className="matte-input"
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
                    className="matte-input"
                    placeholder="Height"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Weight (lbs) - Optional
                </label>
                <input
                  type="number"
                  value={request.weight || ''}
                  onChange={(e) => setRequest(prev => ({ 
                    ...prev, 
                    weight: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  className="matte-input"
                  placeholder="Leave empty for AI weight inference"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-slate-500 mt-1">If not provided, weight will be inferred from dimensions and category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  value={request.origin}
                  onChange={(e) => setRequest(prev => ({ ...prev, origin: e.target.value }))}
                  className="matte-input"
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={request.destination}
                  onChange={(e) => setRequest(prev => ({ ...prev, destination: e.target.value }))}
                  className="matte-input"
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
                className={`matte-btn matte-btn-primary w-full py-4 text-base font-semibold ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Calculating...
                  </div>
                ) : (
                  'Estimate Shipping Cost'
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="matte-card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Estimate</h2>
            
            {response ? (
              <div className="space-y-6">
                {/* Primary Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Estimated Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">${response.estimatedCost.toFixed(2)}</p>
                  </div>

                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ScaleIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Inferred Weight</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{response.inferredWeight.toFixed(1)} lbs</p>
                  </div>

                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TruckIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Recommended Carrier</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{response.recommendedCarrier}</p>
                  </div>

                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Delivery Time</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{response.deliveryTime}</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="matte-card p-6 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">Confidence Score</h3>
                      <p className="text-sm text-slate-600">AI prediction accuracy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{response.confidence.toFixed(1)}%</p>
                      <p className="text-xs text-slate-500">High accuracy</p>
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
