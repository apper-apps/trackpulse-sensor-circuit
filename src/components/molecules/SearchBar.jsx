import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="w-4 h-4 text-slate-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full"
      />
    </div>
  )
}

export default SearchBar