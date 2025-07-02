import { useState } from 'react'

export const useDateRange = (initialStart, initialEnd) => {
  const [dateRange, setDateRange] = useState({
    start: initialStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: initialEnd || new Date()
  })

  const updateDateRange = (start, end) => {
    setDateRange({ start, end })
  }

  return {
    dateRange,
    updateDateRange
  }
}