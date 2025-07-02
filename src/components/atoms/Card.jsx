import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  ...props 
}) => {
  const baseClasses = 'rounded-xl border border-slate-200 transition-all duration-300'
  const backgroundClasses = gradient 
    ? 'bg-gradient-to-br from-white to-slate-50' 
    : 'bg-white'
  const shadowClasses = 'shadow-card'
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:scale-[1.02]' : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${backgroundClasses} ${shadowClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card