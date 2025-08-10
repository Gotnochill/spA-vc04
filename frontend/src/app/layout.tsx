import './globals.css'
import type { Metadata } from 'next'
import { ChartBarIcon, TruckIcon, DocumentTextIcon, HomeIcon, Bars3Icon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Smart Pricing AI - Life Sciences E-Commerce Intelligence',
  description: 'AI-driven pricing, invoicing, and shipping optimization for life sciences platforms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex flex-col min-h-screen">
          <header className="modern-header sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <ChartBarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        Smart Pricing AI
                      </h1>
                      <span className="text-sm text-blue-100 font-medium">
                        Life Sciences Intelligence Platform
                      </span>
                    </div>
                  </div>
                </div>
                <nav className="hidden md:flex items-center space-x-2">
                  <a href="/" className="modern-btn btn-secondary">
                    <HomeIcon className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                  <a href="/pricing" className="modern-btn btn-secondary">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>Pricing</span>
                  </a>
                  <a href="/shipping" className="modern-btn btn-secondary">
                    <TruckIcon className="w-4 h-4" />
                    <span>Shipping</span>
                  </a>
                  <a href="/invoices" className="modern-btn btn-secondary">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Invoices</span>
                  </a>
                </nav>
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>System Online</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  © 2025 Smart Pricing AI. Built for Life Sciences E-Commerce Excellence.
                </p>
                <div className="flex items-center space-x-6 mt-2 sm:mt-0">
                  <span className="text-xs text-gray-400">Version 2.0.1</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">Hackathon Edition</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
