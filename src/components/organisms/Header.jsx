import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import DateRangePicker from '@/components/molecules/DateRangePicker'

const Header = ({ 
  title, 
  subtitle,
  onMenuToggle,
  showDatePicker = false,
  dateRange,
  onDateChange
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onMenuToggle}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {showDatePicker && dateRange && (
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onDateChange={onDateChange}
            />
          )}
          
          <Button variant="ghost" className="p-2">
            <ApperIcon name="Bell" size={20} />
          </Button>
          
          <Button variant="ghost" className="p-2">
            <ApperIcon name="Settings" size={20} />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header