import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const FilterSelect = ({ 
  options = [], 
  selected = [],
  onSelectionChange,
  placeholder = "Select options",
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleOptionClick = (option) => {
    const isSelected = selected.includes(option.value)
    let newSelection
    
    if (isSelected) {
      newSelection = selected.filter(item => item !== option.value)
    } else {
      newSelection = [...selected, option.value]
    }
    
    onSelectionChange(newSelection)
  }
  
  const selectedOptions = options.filter(option => selected.includes(option.value))
  
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-48"
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" size={16} />
          <span className="font-body">
            {selected.length === 0 
              ? placeholder 
              : `${selected.length} selected`
            }
          </span>
        </div>
        <ApperIcon name="ChevronDown" size={16} />
      </Button>
      
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <Badge 
              key={option.value} 
              variant="primary" 
              size="sm"
              className="flex items-center space-x-1"
            >
              <span>{option.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleOptionClick(option)
                }}
                className="ml-1 hover:bg-primary-300 rounded-full p-0.5"
              >
                <ApperIcon name="X" size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-64 overflow-y-auto">
          <div className="p-3 space-y-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                    isSelected 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <ApperIcon name="Check" size={16} className="text-primary-600" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterSelect