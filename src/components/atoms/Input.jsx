import React from 'react'

const Input = ({ 
  label, 
  error, 
  className = '', 
  id,
  type = 'text',
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={`${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`
          block w-full px-3 py-2 border border-slate-300 rounded-lg
          placeholder-slate-400 text-slate-900 text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors duration-200
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default Input