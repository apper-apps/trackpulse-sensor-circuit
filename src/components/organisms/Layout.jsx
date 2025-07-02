import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/campaigns':
        return 'Campaigns'
      case '/attribution':
        return 'Attribution'
      case '/reports':
        return 'Reports'
      case '/settings':
        return 'Settings'
      default:
        return 'TrackPulse'
    }
  }
  
  const getPageSubtitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Track your marketing performance and attribution'
      case '/campaigns':
        return 'Manage and optimize your marketing campaigns'
      case '/attribution':
        return 'Analyze conversion paths and attribution models'
      case '/reports':
        return 'Generate and schedule marketing reports'
      case '/settings':
        return 'Configure your tracking and preferences'
      default:
        return ''
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          onMenuToggle={() => setSidebarOpen(true)}
          showDatePicker={location.pathname === '/' || location.pathname === '/campaigns'}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout