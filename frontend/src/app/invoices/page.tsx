'use client'

import { useState } from 'react'
import { DocumentTextIcon, UserGroupIcon, CalculatorIcon, TagIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline'
import CustomDropdown from '../../components/CustomDropdown'

interface InvoiceRequest {
  customerType: string
  orderValue: number
  productCategory: string
  region: string
  promotionCode?: string
  urgency: string
}

interface InvoiceField {
  name: string
  value: string | number
  required: boolean
  type: 'text' | 'number' | 'currency' | 'percentage'
}

interface InvoiceResponse {
  invoiceNumber: string
  totalAmount: number
  taxAmount: number
  tariffAmount: number
  discountAmount: number
  netAmount: number
  fields: InvoiceField[]
  processingTime: string
}

export default function InvoicePage() {
  const [request, setRequest] = useState<InvoiceRequest>({
    customerType: 'academic',
    orderValue: 0,
    productCategory: 'reagents',
    region: 'north-america',
    promotionCode: '',
    urgency: 'standard'
  })
  
  const [response, setResponse] = useState<InvoiceResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const customerTypeOptions = [
    { value: 'academic', label: 'Academic', description: 'Universities and research institutions' },
    { value: 'enterprise', label: 'Enterprise', description: 'Large commercial organizations' },
    { value: 'government', label: 'Government', description: 'Government agencies and departments' },
    { value: 'startup', label: 'Startup', description: 'Small businesses and startups' },
    { value: 'non-profit', label: 'Non-Profit', description: 'Non-profit organizations' }
  ]

  const categoryOptions = [
    { value: 'reagents', label: 'Reagents', description: 'Chemical reagents and solutions' },
    { value: 'equipment', label: 'Laboratory Equipment', description: 'Scientific instruments' },
    { value: 'consumables', label: 'Consumables', description: 'Disposable lab supplies' },
    { value: 'software', label: 'Software', description: 'Laboratory software and licenses' },
    { value: 'services', label: 'Services', description: 'Consulting and support services' }
  ]

  const regionOptions = [
    { value: 'north-america', label: 'North America', description: 'USA, Canada, Mexico' },
    { value: 'europe', label: 'Europe', description: 'European Union countries' },
    { value: 'asia-pacific', label: 'Asia Pacific', description: 'Asian and Pacific regions' },
    { value: 'latin-america', label: 'Latin America', description: 'Central and South America' },
    { value: 'middle-east-africa', label: 'Middle East & Africa', description: 'MEA region' }
  ]

  const urgencyOptions = [
    { value: 'standard', label: 'Standard', description: 'Regular processing, 2-3 business days' },
    { value: 'expedited', label: 'Expedited', description: 'Fast processing, same day' },
    { value: 'urgent', label: 'Urgent', description: 'Immediate processing, within hours' }
  ]

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/invoices/generate', {
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
        const baseAmount = request.orderValue
        const taxRate = request.region === 'europe' ? 0.20 : 0.08
        const tariffRate = request.region === 'asia-pacific' ? 0.15 : 0.05
        const discountRate = request.customerType === 'academic' ? 0.10 : 0.05
        
        const taxAmount = baseAmount * taxRate
        const tariffAmount = baseAmount * tariffRate
        const discountAmount = baseAmount * discountRate
        const netAmount = baseAmount + taxAmount + tariffAmount - discountAmount

        setResponse({
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          totalAmount: baseAmount,
          taxAmount,
          tariffAmount,
          discountAmount,
          netAmount,
          processingTime: request.urgency === 'urgent' ? '2 hours' : request.urgency === 'expedited' ? '4 hours' : '24 hours',
          fields: [
            { name: 'Customer Type', value: request.customerType, required: true, type: 'text' },
            { name: 'Product Category', value: request.productCategory, required: true, type: 'text' },
            { name: 'Region', value: request.region, required: true, type: 'text' },
            { name: 'Base Amount', value: baseAmount, required: true, type: 'currency' },
            { name: 'Tax Rate', value: taxRate * 100, required: true, type: 'percentage' },
            { name: 'Tariff Rate', value: tariffRate * 100, required: true, type: 'percentage' },
            { name: 'Discount Rate', value: discountRate * 100, required: false, type: 'percentage' }
          ]
        })
      }
    } catch (error) {
      // Demo data for offline mode (same as above)
      const baseAmount = request.orderValue
      const taxRate = request.region === 'europe' ? 0.20 : 0.08
      const tariffRate = request.region === 'asia-pacific' ? 0.15 : 0.05
      const discountRate = request.customerType === 'academic' ? 0.10 : 0.05
      
      const taxAmount = baseAmount * taxRate
      const tariffAmount = baseAmount * tariffRate
      const discountAmount = baseAmount * discountRate
      const netAmount = baseAmount + taxAmount + tariffAmount - discountAmount

      setResponse({
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        totalAmount: baseAmount,
        taxAmount,
        tariffAmount,
        discountAmount,
        netAmount,
        processingTime: request.urgency === 'urgent' ? '2 hours' : request.urgency === 'expedited' ? '4 hours' : '24 hours',
        fields: [
          { name: 'Customer Type', value: request.customerType, required: true, type: 'text' },
          { name: 'Product Category', value: request.productCategory, required: true, type: 'text' },
          { name: 'Region', value: request.region, required: true, type: 'text' },
          { name: 'Base Amount', value: baseAmount, required: true, type: 'currency' },
          { name: 'Tax Rate', value: taxRate * 100, required: true, type: 'percentage' },
          { name: 'Tariff Rate', value: tariffRate * 100, required: true, type: 'percentage' },
          { name: 'Discount Rate', value: discountRate * 100, required: false, type: 'percentage' }
        ]
      })
    }
    setLoading(false)
  }

  const formatFieldValue = (field: InvoiceField) => {
    switch (field.type) {
      case 'currency':
        return `$${(field.value as number).toFixed(2)}`
      case 'percentage':
        return `${(field.value as number).toFixed(1)}%`
      case 'number':
        return (field.value as number).toLocaleString()
      default:
        return field.value.toString()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dynamic Invoice Generator</h1>
              <p className="text-slate-600">Adaptive field management with automated tariff calculation</p>
            </div>
          </div>
          
          <div className="matte-card p-4">
            <div className="flex items-center space-x-3">
              <div className="status-dot status-success"></div>
              <span className="text-sm font-medium text-slate-700">Adaptive Invoice Engine</span>
              <span className="text-xs text-slate-500">• Smart field generation active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="matte-card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Invoice Configuration</h2>
            
            <div className="space-y-6">
              <CustomDropdown
                options={customerTypeOptions}
                value={request.customerType}
                onChange={(value) => setRequest(prev => ({ ...prev, customerType: value }))}
                label="Customer Type"
                placeholder="Select customer type"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Order Value ($)
                </label>
                <input
                  type="number"
                  value={request.orderValue}
                  onChange={(e) => setRequest(prev => ({ ...prev, orderValue: parseFloat(e.target.value) || 0 }))}
                  className="matte-input"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <CustomDropdown
                options={categoryOptions}
                value={request.productCategory}
                onChange={(value) => setRequest(prev => ({ ...prev, productCategory: value }))}
                label="Product Category"
                placeholder="Select product type"
              />

              <CustomDropdown
                options={regionOptions}
                value={request.region}
                onChange={(value) => setRequest(prev => ({ ...prev, region: value }))}
                label="Region"
                placeholder="Select region"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Promotion Code (Optional)
                </label>
                <input
                  type="text"
                  value={request.promotionCode}
                  onChange={(e) => setRequest(prev => ({ ...prev, promotionCode: e.target.value }))}
                  className="matte-input"
                  placeholder="Enter promotion code"
                />
              </div>

              <CustomDropdown
                options={urgencyOptions}
                value={request.urgency}
                onChange={(value) => setRequest(prev => ({ ...prev, urgency: value }))}
                label="Processing Urgency"
                placeholder="Select processing speed"
              />

              <button
                onClick={handleGenerate}
                disabled={loading || request.orderValue <= 0}
                className={`matte-btn matte-btn-primary w-full py-4 text-base font-semibold ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Invoice'
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="matte-card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Invoice Preview</h2>
            
            {response ? (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="matte-card p-6 bg-purple-50 border-purple-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Invoice #{response.invoiceNumber}</h3>
                      <p className="text-sm text-slate-600">Generated for {request.customerType} customer</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Processing Time</p>
                      <p className="font-semibold text-purple-600">{response.processingTime}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Base Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">${response.totalAmount.toFixed(2)}</p>
                  </div>

                  <div className="metric-block">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CalculatorIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Final Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">${response.netAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="matte-card p-6 bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-4">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Base Amount:</span>
                      <span className="font-medium text-slate-900">${response.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Tax Amount:</span>
                      <span className="font-medium text-slate-900">+${response.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Tariff Amount:</span>
                      <span className="font-medium text-slate-900">+${response.tariffAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Discount Amount:</span>
                      <span className="font-medium text-green-600">-${response.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900">Net Amount:</span>
                        <span className="font-bold text-lg text-green-600">${response.netAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Fields */}
                <div className="matte-card p-6 bg-blue-50">
                  <h3 className="font-semibold text-slate-900 mb-4">Adaptive Invoice Fields</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {response.fields.map((field, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border border-blue-200">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-slate-900">{field.name}</span>
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                        <span className="text-sm text-slate-700">{formatFieldValue(field)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="matte-btn matte-btn-primary flex-1">
                    Download PDF
                  </button>
                  <button className="matte-btn matte-btn-secondary flex-1">
                    Send Invoice
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-2">Ready for Invoice Generation</p>
                <p className="text-sm text-slate-400">Configure invoice parameters to generate a dynamic, adaptive invoice</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
