import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item",
  action,
  actionLabel = "Get Started",
  icon = "Database"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-slate-800 mb-3">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-md">
        {description}
      </p>
      
      {action && (
        <Button 
          onClick={action}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </motion.div>
  )
}

export default Empty