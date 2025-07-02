import React from 'react'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium font-body rounded-full'
  
  const variants = {
    default: 'bg-slate-100 text-slate-800',
    primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800',
    success: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
    danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
    info: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge