import React from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-campuskart-bg flex flex-col font-sans" style={{ backgroundColor: '#F4F8F5' }}>
      {/* Global Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: '#00C853' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">CampusKart</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/browse" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                activeProps={{ className: 'text-gray-900 font-semibold' }}
              >
                Browse
              </Link>
              <Link 
                to="/auth" 
                className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                style={{ backgroundColor: '#00C853' }}
              >
                Sign in
              </Link>
            </nav>

          </div>
        </div>
      </header>

      {/* Dynamic Page Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CampusKart. All rights reserved.
      </footer>
    </div>
  )
}
