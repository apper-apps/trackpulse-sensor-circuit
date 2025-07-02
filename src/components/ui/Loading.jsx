import React from 'react'

const Loading = ({ variant = 'dashboard' }) => {
  if (variant === 'dashboard') {
    return (
      <div className="animate-pulse">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-card p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
                <div className="w-16 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-2"></div>
              <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-card p-6 border border-slate-200">
            <div className="w-48 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-6"></div>
            <div className="w-full h-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
          </div>
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-card p-6 border border-slate-200">
            <div className="w-36 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-6"></div>
            <div className="w-full h-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
          </div>
        </div>
        
        {/* Table Section */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-card border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="w-40 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          </div>
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3 border-b border-slate-100 last:border-0">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-2"></div>
                  <div className="w-24 h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                </div>
                <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                <div className="w-16 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
            <div className="flex-1">
              <div className="w-32 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-2"></div>
              <div className="w-24 h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
            </div>
            <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
            <div className="w-16 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
            <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
    </div>
  )
}

export default Loading