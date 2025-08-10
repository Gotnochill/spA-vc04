'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, UserGroupIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, DocumentArrowDownIcon, SparklesIcon, BeakerIcon, ClockIcon, TagIcon, CpuChipIcon } from '@heroicons/react/24/outline'

interface AdvancedAnalytics {
  customer_segmentation?: any
  price_elasticity_models?: any
  seasonality_insights?: any
  promotional_effectiveness?: any
  data_quality?: any
  error?: string
}

interface PricingInsights {
  basic_insights?: {
    total_products_analyzed: number
    customer_segments: number
    pricing_models_active: number
  }
  advanced_insights?: AdvancedAnalytics
  recommendations?: {
    top_optimization_opportunities: string[]
    revenue_impact_potential: string
    margin_improvement_potential: string
  }
  error?: string
}

interface HealthStatus {
  status: string
  models_loaded: number
  advanced_features: boolean
  features_available: string[]
  data_quality?: {
    historical_transactions: number
  }
  error?: string
}

export default function AdvancedPricingPage() {
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null)
  const [insights, setInsights] = useState<PricingInsights | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState({
    analytics: false,
    insights: false,
    health: false
  })

  useEffect(() => {
    fetchHealthStatus()
    fetchInsights()
    fetchAdvancedAnalytics()
  }, [])

  const fetchHealthStatus = async () => {
    setLoading(prev => ({ ...prev, health: true }))
    try {
      const response = await fetch('http://localhost:8000/api/pricing/health')
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      console.error('Error fetching health status:', error)
      setHealth({
        status: 'error',
        models_loaded: 0,
        advanced_features: false,
        features_available: ['Basic Pricing Optimization'],
        error: 'Connection failed'
      })
    } finally {
      setLoading(prev => ({ ...prev, health: false }))
    }
  }

  const fetchInsights = async () => {
    setLoading(prev => ({ ...prev, insights: true }))
    try {
      const response = await fetch('http://localhost:8000/api/pricing/insights')
      const data = await response.json()
      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
      setInsights({
        basic_insights: {
          total_products_analyzed: 0,
          customer_segments: 0,
          pricing_models_active: 0
        },
        error: 'Failed to fetch insights'
      })
    } finally {
      setLoading(prev => ({ ...prev, insights: false }))
    }
  }

  const fetchAdvancedAnalytics = async () => {
    setLoading(prev => ({ ...prev, analytics: true }))
    try {
      const response = await fetch('http://localhost:8000/api/pricing/advanced-analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching advanced analytics:', error)
      setAnalytics({
        error: 'Failed to fetch advanced analytics'
      })
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }))
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      degraded: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.error}`}>
        {status}
      </span>
    )
  }

  const FeatureBadge = ({ feature, available }: { feature: string, available: boolean }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
      available ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
    }`}>
      {available ? <SparklesIcon className="w-3 h-3 mr-1" /> : <CpuChipIcon className="w-3 h-3 mr-1" />}
      {feature}
    </span>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Pricing Analytics</h1>
          <p className="text-gray-600">AI-powered pricing intelligence with historical data analysis, customer segmentation, and predictive modeling</p>
        </div>

        {/* System Health Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CpuChipIcon className="w-5 h-5 mr-2" />
              System Health & Capabilities
            </h2>
            {health && <StatusBadge status={health.status} />}
          </div>

          {loading.health ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ) : health ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Models Loaded</p>
                <p className="text-2xl font-bold text-blue-600">{health.models_loaded}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Advanced Features</p>
                <p className="text-2xl font-bold text-green-600">{health.advanced_features ? 'Enabled' : 'Disabled'}</p>
              </div>
              {health.data_quality && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Historical Transactions</p>
                  <p className="text-2xl font-bold text-purple-600">{health.data_quality.historical_transactions.toLocaleString()}</p>
                </div>
              )}
            </div>
          ) : null}

          {health?.features_available && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Available Features:</p>
              <div className="flex flex-wrap gap-2">
                {health.features_available.map((feature, index) => (
                  <FeatureBadge 
                    key={index} 
                    feature={feature} 
                    available={health.advanced_features || feature === 'Basic Pricing Optimization'} 
                  />
                ))}
              </div>
            </div>
          )}

          {health?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{health.error}</p>
            </div>
          )}
        </div>

        {/* Quick Insights Overview */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BeakerIcon className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Products Analyzed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {insights.basic_insights?.total_products_analyzed || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <UserGroupIcon className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Customer Segments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {insights.basic_insights?.customer_segments || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Active Models</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {insights.basic_insights?.pricing_models_active || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="w-8 h-8 text-orange-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                  <p className="text-lg font-bold text-gray-900">
                    {insights.recommendations?.revenue_impact_potential?.split(' ')[0] || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Customer Segmentation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Customer Segmentation
            </h3>
            
            {loading.analytics ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : analytics?.customer_segmentation ? (
              <div className="space-y-3">
                {Object.entries(analytics.customer_segmentation).map(([segment, data]: [string, any]) => (
                  <div key={segment} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">{segment}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <div>Avg Revenue: ${data.avg_revenue?.toFixed(0) || 'N/A'}</div>
                      <div>Price Sensitivity: {data.price_sensitivity?.toFixed(1) || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Advanced segmentation requires historical data</p>
              </div>
            )}
          </div>

          {/* Seasonality Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Seasonality Insights
            </h3>
            
            {loading.analytics ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : analytics?.seasonality_insights ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Yearly Trend:</span>
                  <span className="font-medium">{analytics.seasonality_insights.yearly_trend || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Seasonality Strength:</span>
                  <span className="font-medium">{analytics.seasonality_insights.seasonality_strength || 'N/A'}</span>
                </div>
                {analytics.seasonality_insights.peak_months && (
                  <div>
                    <span className="text-sm text-gray-600">Peak Months:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {analytics.seasonality_insights.peak_months.map((month: number) => (
                        <span key={month} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {new Date(2024, month - 1).toLocaleString('default', { month: 'short' })}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Seasonality analysis requires time-series data</p>
              </div>
            )}
          </div>
        </div>

        {/* Price Elasticity & Promotional Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Price Elasticity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Price Elasticity Models
            </h3>
            
            {loading.analytics ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : analytics?.price_elasticity_models && Object.keys(analytics.price_elasticity_models).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analytics.price_elasticity_models).slice(0, 5).map(([sku, data]: [string, any]) => (
                  <div key={sku} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{sku}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        data.demand_sensitivity === 'High' ? 'bg-red-100 text-red-800' :
                        data.demand_sensitivity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {data.demand_sensitivity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Elasticity: {data.elasticity_coefficient?.toFixed(2)} | 
                      Strategy: {data.optimal_price_strategy}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Price elasticity models require transaction history</p>
              </div>
            )}
          </div>

          {/* Promotional Impact */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Promotional Effectiveness
            </h3>
            
            {loading.analytics ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : analytics?.promotional_effectiveness?.overall_impact ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue Lift:</span>
                  <span className="font-medium">
                    {(analytics.promotional_effectiveness.overall_impact.revenue_lift * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Optimal Discount:</span>
                  <span className="font-medium">
                    {analytics.promotional_effectiveness.overall_impact.optimal_discount_range?.min}% - {analytics.promotional_effectiveness.overall_impact.optimal_discount_range?.max}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TagIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Promotional analysis requires discount history</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        {insights?.recommendations && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2" />
              AI Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Optimization Opportunities</h4>
                <ul className="space-y-1">
                  {insights.recommendations.top_optimization_opportunities.map((opportunity, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Revenue Impact</h4>
                <p className="text-2xl font-bold text-green-600">
                  {insights.recommendations.revenue_impact_potential}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Margin Improvement</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {insights.recommendations.margin_improvement_potential}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error States */}
        {(analytics?.error || insights?.error) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Limited Functionality</h3>
            <p className="text-yellow-700 mb-4">
              Some advanced features are currently unavailable. This may be due to:
            </p>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>Missing historical transaction data</li>
              <li>Advanced ML models not trained</li>
              <li>Python dependencies not installed</li>
            </ul>
            <p className="text-yellow-700 mt-4">
              The system will fall back to basic pricing optimization features.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
