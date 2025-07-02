import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: 'BarChart3',
      description: 'Overview & metrics'
    },
    {
      name: 'Campaigns',
      href: '/campaigns',
      icon: 'Target',
      description: 'Campaign management'
    },
{
      name: 'Attribution',
      href: '/attribution',
      icon: 'GitBranch',
      description: 'Attribution models'
    },
    {
      name: 'Cross-Device',
      href: '/cross-device',
      icon: 'Smartphone',
      description: 'Device journey tracking'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: 'FileText',
      description: 'Analytics & exports'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: 'Settings',
      description: 'Preferences & integrations'
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : '-100%'
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`
          fixed top-0 left-0 z-50 h-full
          lg:static lg:translate-x-0 lg:z-auto
          w-64 bg-slate-800 border-r border-slate-700
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white">
                TrackPulse
              </h1>
              <p className="text-xs text-slate-400">Attribution Platform</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose()
                }
              }}
              className={({ isActive }) => `
                flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-primary text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              <ApperIcon 
                name={item.icon} 
                className="w-5 h-5 mr-3 flex-shrink-0" 
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75 group-hover:opacity-100">
                  {item.description}
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Marketing Team</p>
              <p className="text-xs text-slate-400">Premium Plan</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar