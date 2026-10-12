import React from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Global Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <svg 
                className="w-7 h-7 text-black" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span className="text-xl font-bold text-gray-900 tracking-tight">CampusKart</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/browse" 
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                activeProps={{ className: 'text-black font-semibold' }}
              >
                Browse
              </Link>
              <Link 
                to="/auth" 
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                activeProps={{ className: 'text-black font-semibold' }}
              >
                Sign in
              </Link>
            </nav>

          </div>
        </div>
      </header>

      {/* Dynamic Page Content Rendered Here */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CampusKart. All rights reserved.
      </footer>
    </div>
  )
}