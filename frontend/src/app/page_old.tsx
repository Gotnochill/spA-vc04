'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, TruckIcon, DocumentTextIcon, CogIcon, ArrowUpIcon, ArrowTrendingUpIcon, BanknotesIcon, ShoppingCartIcon, ClockIcon } from '@heroicons/react/24/outline'

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
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center">
              <CogIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Smart Pricing Dashboard</h1>
              <p className="text-slate-600 text-sm">Advanced pricing optimization and analytics platform</p>
            </div>
          </div>
          
          <div className="matte-card p-4">
            <div className="flex items-center space-x-3">
              <div className="status-dot status-success"></div>
              <span className="text-sm font-medium text-slate-700">AI-Powered Intelligence Platform</span>
              <span className="text-xs text-slate-500">• Real-time optimization active</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
            <span className="ml-3 text-slate-600">Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="matte-card metric-block">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12.5%</span>
                </div>
                <h3 className="text-xs font-medium text-slate-600 mb-1">Total Revenue</h3>
                <p className="text-xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">vs last month</p>
              </div>

              <div className="matte-card metric-block">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+2.1%</span>
                </div>
                <h3 className="text-xs font-medium text-slate-600 mb-1">Average Margin</h3>
                <p className="text-xl font-bold text-slate-900">{stats.avgMargin}%</p>
                <p className="text-xs text-slate-500 mt-1">optimized pricing</p>
              </div>

              <div className="matte-card metric-block">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingCartIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">+8.3%</span>
                </div>
                <h3 className="text-xs font-medium text-slate-600 mb-1">Orders Processed</h3>
                <p className="text-xl font-bold text-slate-900">{stats.ordersProcessed.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">this week</p>
              </div>

              <div className="matte-card metric-block">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TruckIcon className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">+1.2%</span>
                </div>
                <h3 className="text-xs font-medium text-slate-600 mb-1">Shipping Accuracy</h3>
                <p className="text-xl font-bold text-slate-900">{stats.shippingAccuracy}%</p>
                <p className="text-xs text-slate-500 mt-1">delivery precision</p>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="matte-card p-4 text-center">
                <p className="text-lg font-bold text-slate-900">{stats.recentOrders}</p>
                <p className="text-sm text-slate-600">Recent Orders</p>
              </div>
              <div className="matte-card p-4 text-center">
                <p className="text-lg font-bold text-slate-900">${stats.avgOrderValue.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Avg Order Value</p>
              </div>
              <div className="matte-card p-4 text-center">
                <p className="text-lg font-bold text-slate-900">{stats.topPerformingCategory}</p>
                <p className="text-sm text-slate-600">Top Category</p>
              </div>
              <div className="matte-card p-4 text-center">
                <p className="text-lg font-bold text-slate-900">{stats.priceOptimizations}</p>
                <p className="text-sm text-slate-600">AI Optimizations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="matte-card p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <a href="/pricing" className="action-block">
                    <div className="action-block-icon bg-blue-100">
                      <ChartBarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Optimize Pricing</h3>
                      <p className="text-sm text-slate-600">AI-driven price optimization and elasticity analysis</p>
                    </div>
                    <ArrowUpIcon className="w-4 h-4 text-slate-400 rotate-45" />
                  </a>

                  <a href="/shipping" className="action-block">
                    <div className="action-block-icon bg-green-100">
                      <TruckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Calculate Shipping</h3>
                      <p className="text-sm text-slate-600">Smart weight inference and carrier optimization</p>
                    </div>
                    <ArrowUpIcon className="w-4 h-4 text-slate-400 rotate-45" />
                  </a>

                  <a href="/invoices" className="action-block">
                    <div className="action-block-icon bg-purple-100">
                      <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Generate Invoice</h3>
                      <p className="text-sm text-slate-600">Dynamic adaptive invoicing with tariff calculation</p>
                    </div>
                    <ArrowUpIcon className="w-4 h-4 text-slate-400 rotate-45" />
                  </a>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="matte-card p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'pricing' ? 'bg-blue-100' :
                        activity.type === 'shipping' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'pricing' && <ChartBarIcon className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'shipping' && <TruckIcon className="w-4 h-4 text-green-600" />}
                        {activity.type === 'invoice' && <DocumentTextIcon className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="w-3 h-3 text-slate-400 mr-1" />
                          <p className="text-xs text-slate-500">{activity.timestamp}</p>
                          {activity.value && (
                            <span className="ml-2 text-xs font-medium text-green-600">
                              +${activity.value}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`status-dot ${
                        activity.status === 'success' ? 'status-success' :
                        activity.status === 'pending' ? 'status-pending' : 'status-warning'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
