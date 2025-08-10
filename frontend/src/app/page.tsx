'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TruckIcon, 
  DocumentTextIcon, 
  BanknotesIcon, 
  ShoppingCartIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  SparklesIcon,
  CogIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalRevenue: number
  avgMargin: number
  ordersProcessed: number
  shippingAccuracy: number
  recentOrders: number
  avgOrderValue: number
  topPerformingCategory: string
  priceOptimizations: number
}

interface RecentActivity {
  id: string
  type: 'pricing' | 'shipping' | 'invoice'
  description: string
  timestamp: string
  value?: number
  status: 'success' | 'pending' | 'warning'
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    avgMargin: 0,
    ordersProcessed: 0,
    shippingAccuracy: 0,
    recentOrders: 0,
    avgOrderValue: 0,
    topPerformingCategory: '',
    priceOptimizations: 0
  })

  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalRevenue: 2847392,
        avgMargin: 28.5,
        ordersProcessed: 1247,
        shippingAccuracy: 94.2,
        recentOrders: 89,
        avgOrderValue: 2284,
        topPerformingCategory: 'Laboratory Equipment',
        priceOptimizations: 156
      })

      setActivities([
        {
          id: '1',
          type: 'pricing',
          description: 'Price optimization completed for PCR Kit Pro',
          timestamp: '2 minutes ago',
          value: 15.2,
          status: 'success'
        },
        {
          id: '2',
          type: 'shipping',
          description: 'Shipping estimate generated for bulk order',
          timestamp: '5 minutes ago',
          value: 245.80,
          status: 'success'
        },
        {
          id: '3',
          type: 'invoice',
          description: 'Dynamic invoice created for Academic Institute',
          timestamp: '12 minutes ago',
          status: 'pending'
        },
        {
          id: '4',
          type: 'pricing',
          description: 'Customer segmentation analysis updated',
          timestamp: '25 minutes ago',
          status: 'success'
        }
      ])
      setLoading(false)
    }, 1200)
  }, [])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="mb-12">
          <div className="glass-card p-8 text-center floating-element">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-gray-800 mb-4">
              Welcome to Smart Pricing AI
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Advanced pricing optimization and analytics platform designed specifically for life sciences e-commerce
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="status-indicator success"></div>
              <span className="text-sm font-semibold text-gray-700">AI Systems Online & Optimizing</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="loading-spinner"></div>
            <span className="ml-4 text-white text-lg font-medium">Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <div className="responsive-grid mb-12">
              <div className="metric-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <BanknotesIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    +12.5%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
                <p className="text-3xl font-black text-gray-800 mb-1">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">vs last month</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    +2.1%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Average Margin</h3>
                <p className="text-3xl font-black text-gray-800 mb-1">{stats.avgMargin}%</p>
                <p className="text-xs text-gray-400">AI optimized</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShoppingCartIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    +8.3%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Orders Processed</h3>
                <p className="text-3xl font-black text-gray-800 mb-1">
                  {stats.ordersProcessed.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">this week</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <TruckIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    +1.2%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Accuracy</h3>
                <p className="text-3xl font-black text-gray-800 mb-1">{stats.shippingAccuracy}%</p>
                <p className="text-xs text-gray-400">delivery precision</p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <a href="/pricing" className="action-card">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg action-icon">
                    <ChartBarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">AI Pricing Optimization</h3>
                    <p className="text-sm text-gray-500">Advanced elasticity analysis</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Leverage machine learning to optimize pricing strategies with customer segmentation and margin analysis.
                </p>
                <div className="modern-btn btn-primary">
                  <PlayIcon className="w-4 h-4" />
                  <span>Start Optimization</span>
                </div>
              </a>

              <a href="/shipping" className="action-card">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg action-icon">
                    <TruckIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Smart Shipping Calculator</h3>
                    <p className="text-sm text-gray-500">Weight inference & sourcing</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Intelligent weight prediction and multi-carrier optimization for accurate shipping cost estimation.
                </p>
                <div className="modern-btn btn-primary">
                  <PlayIcon className="w-4 h-4" />
                  <span>Calculate Shipping</span>
                </div>
              </a>

              <a href="/invoices" className="action-card">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg action-icon">
                    <DocumentTextIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Dynamic Invoice Generator</h3>
                    <p className="text-sm text-gray-500">Adaptive field management</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Generate intelligent invoices with adaptive fields, tariff calculations, and promotion management.
                </p>
                <div className="modern-btn btn-primary">
                  <PlayIcon className="w-4 h-4" />
                  <span>Generate Invoice</span>
                </div>
              </a>
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Recent Activity</h2>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          activity.type === 'pricing' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                          activity.type === 'shipping' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 
                          'bg-gradient-to-br from-purple-400 to-pink-500'
                        } shadow-lg`}>
                          {activity.type === 'pricing' && <ChartBarIcon className="w-5 h-5 text-white" />}
                          {activity.type === 'shipping' && <TruckIcon className="w-5 h-5 text-white" />}
                          {activity.type === 'invoice' && <DocumentTextIcon className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{activity.description}</p>
                          <div className="flex items-center mt-2">
                            <ClockIcon className="w-3 h-3 text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            {activity.value && (
                              <span className="ml-3 text-xs font-bold text-green-600">
                                +${activity.value}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`status-indicator ${activity.status}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Performance Insights</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                    <div>
                      <p className="text-2xl font-black text-gray-800">{stats.recentOrders}</p>
                      <p className="text-sm text-gray-500">Recent Orders</p>
                    </div>
                    <ShoppingCartIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                    <div>
                      <p className="text-2xl font-black text-gray-800">${stats.avgOrderValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Avg Order Value</p>
                    </div>
                    <BanknotesIcon className="w-8 h-8 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <div>
                      <p className="text-lg font-black text-gray-800">{stats.topPerformingCategory}</p>
                      <p className="text-sm text-gray-500">Top Category</p>
                    </div>
                    <CogIcon className="w-8 h-8 text-purple-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
                    <div>
                      <p className="text-2xl font-black text-gray-800">{stats.priceOptimizations}</p>
                      <p className="text-sm text-gray-500">AI Optimizations</p>
                    </div>
                    <SparklesIcon className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
