import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon, 
  iconColor = 'text-primary-600',
  trend = []
}) => {
  const changeIcon = changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'
  const changeColor = changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
  
  // Create sparkline path
  const createSparklinePath = (data) => {
    if (data.length === 0) return ''
    
    const width = 60
    const height = 20
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    }).join(' ')
    
    return `M ${points.split(' ').join(' L ')}`
  }
  
  return (
    <Card gradient className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className={`w-5 h-5 ${iconColor}`} />
        </div>
        
        {trend.length > 0 && (
          <div className="w-16 h-6">
            <svg width="60" height="20" className="overflow-visible">
              <path
                d={createSparklinePath(trend)}
                className="sparkline stroke-primary-500"
                fill="none"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-slate-600 font-body">
          {title}
        </p>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-display font-bold gradient-text">
            {value}
          </p>
          
          {change && (
            <div className={`flex items-center space-x-1 text-xs font-medium ${changeColor}`}>
              <ApperIcon name={changeIcon} size={14} />
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default MetricCard