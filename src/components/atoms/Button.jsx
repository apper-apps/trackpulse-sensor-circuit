import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-lg focus:ring-primary-500 hover:scale-105',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-primary-500 hover:border-slate-400',
    outline: 'bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50 focus:ring-primary-500',
    success: 'bg-gradient-emerald text-white hover:shadow-lg focus:ring-emerald-500 hover:scale-105',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg focus:ring-red-500 hover:scale-105',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:ring-slate-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg'
  }
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button