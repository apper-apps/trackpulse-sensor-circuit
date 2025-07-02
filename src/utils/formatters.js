export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number)
}

export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`
}

export const formatDate = (date, format = 'short') => {
  const options = {
    short: { month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  }
  
  return new Intl.DateTimeFormat('en-US', options[format]).format(new Date(date))
}

export const formatRoas = (roas) => {
  return `${roas.toFixed(2)}x`
}

export const abbreviateNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const calculateGrowth = (current, previous) => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const formatDeviceType = (device) => {
  const deviceNames = {
    desktop: 'Desktop',
    mobile: 'Mobile',
    tablet: 'Tablet',
    smart_tv: 'Smart TV',
    wearable: 'Wearable',
    unknown: 'Unknown'
  }
  return deviceNames[device] || 'Unknown Device'
}

export const formatDuration = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end - start
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}