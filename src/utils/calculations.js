export const calculateRoas = (revenue, spend) => {
  if (spend === 0) return 0
  return revenue / spend
}

export const calculateCpa = (spend, conversions) => {
  if (conversions === 0) return 0
  return spend / conversions
}

export const calculateCtr = (clicks, impressions) => {
  if (impressions === 0) return 0
  return (clicks / impressions) * 100
}

export const calculateConversionRate = (conversions, clicks) => {
  if (clicks === 0) return 0
  return (conversions / clicks) * 100
}

export const calculateRevenue = (conversions, averageOrderValue) => {
  return conversions * averageOrderValue
}

export const calculateMargin = (revenue, costs) => {
  if (revenue === 0) return 0
  return ((revenue - costs) / revenue) * 100
}

export const attributeConversion = (touchpoints, model = 'last-touch') => {
  if (!touchpoints || touchpoints.length === 0) return {}
  
  const attribution = {}
  
  touchpoints.forEach((touchpoint, index) => {
    const channelId = touchpoint.channelId
    if (!attribution[channelId]) {
      attribution[channelId] = 0
    }
    
    let credit = 0
    
    switch (model) {
      case 'first-touch':
        credit = index === 0 ? 1 : 0
        break
      case 'last-touch':
        credit = index === touchpoints.length - 1 ? 1 : 0
        break
      case 'linear':
        credit = 1 / touchpoints.length
        break
      case 'time-decay':
        const timeWeight = Math.pow(2, index - touchpoints.length + 1)
        const totalWeight = touchpoints.reduce((sum, _, i) => 
          sum + Math.pow(2, i - touchpoints.length + 1), 0)
        credit = timeWeight / totalWeight
        break
      default:
        credit = 1 / touchpoints.length
    }
    
    attribution[channelId] += credit
  })
  
  return attribution
}