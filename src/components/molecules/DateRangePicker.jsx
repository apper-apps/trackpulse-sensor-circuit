import React, { useState } from 'react'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onDateChange,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This month', days: 'month' },
    { label: 'Last month', days: 'lastMonth' }
  ]
  
  const handlePresetClick = (preset) => {
    const end = new Date()
    let start = new Date()
    
    if (preset.days === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1)
    } else if (preset.days === 'lastMonth') {
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1)
      end.setDate(0) // Last day of previous month
    } else {
      start.setDate(end.getDate() - preset.days)
    }
    
    onDateChange(start, end)
    setIsOpen(false)
  }
  
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <ApperIcon name="Calendar" size={16} />
        <span className="font-body">
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </span>
        <ApperIcon name="ChevronDown" size={16} />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
          <div className="p-3 space-y-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker