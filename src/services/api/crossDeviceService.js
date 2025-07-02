import conversionsData from '@/services/mockData/conversions.json'

class CrossDeviceService {
  async getJourneys(deviceFilter = 'all', timeRange = '7d') {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const daysBack = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    }[timeRange] || 7
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysBack)
    
    // Transform conversions into cross-device journeys
    const journeys = conversionsData
      .filter(conversion => {
        const conversionDate = new Date(conversion.timestamp)
        return conversionDate >= cutoffDate
      })
      .map(conversion => {
        const devices = this.extractDevicesFromTouchpoints(conversion.touchpoints || [])
        
        // Filter by device if specified
        if (deviceFilter !== 'all') {
          const hasDevice = devices.some(device => device.type === deviceFilter)
          if (!hasDevice) return null
        }
        
        return {
          Id: conversion.Id,
          customerId: conversion.customerId,
          startTime: devices.length > 0 ? devices[0].firstInteraction : conversion.timestamp,
          endTime: conversion.timestamp,
          isConverted: true,
          revenue: conversion.revenue,
          devices: devices,
          totalTouchpoints: conversion.touchpoints?.length || 0
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))

    return [...journeys]
  }

  async getDeviceMetrics(timeRange = '7d') {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const journeys = await this.getJourneys('all', timeRange)
    
    const crossDeviceJourneys = journeys.filter(j => j.devices.length > 1)
    const totalRevenue = journeys.reduce((sum, j) => sum + (j.revenue || 0), 0)
    const crossDeviceRevenue = crossDeviceJourneys.reduce((sum, j) => sum + (j.revenue || 0), 0)
    
    const mobileToDesktopJourneys = crossDeviceJourneys.filter(j => 
      j.devices.some(d => d.type === 'mobile') && 
      j.devices.some(d => d.type === 'desktop')
    )
    
    const avgDevicesPerJourney = journeys.length > 0 
      ? journeys.reduce((sum, j) => sum + j.devices.length, 0) / journeys.length 
      : 0

    return {
      crossDeviceConversions: crossDeviceJourneys.length,
      crossDeviceConversionsGrowth: Math.random() * 20 - 10, // Mock growth
      avgDevicesPerJourney: avgDevicesPerJourney,
      avgDevicesGrowth: Math.random() * 15 - 5,
      mobileToDesktopRate: journeys.length > 0 ? (mobileToDesktopJourneys.length / journeys.length) * 100 : 0,
      mobileToDesktopGrowth: Math.random() * 25 - 10,
      crossDeviceRevenue: crossDeviceRevenue,
      crossDeviceRevenueGrowth: Math.random() * 30 - 15
    }
  }

  extractDevicesFromTouchpoints(touchpoints) {
    const deviceMap = new Map()
    
    touchpoints.forEach((touchpoint, index) => {
      // Simulate device detection based on interaction patterns
      let deviceType = this.inferDeviceType(touchpoint, index)
      
      if (!deviceMap.has(deviceType)) {
        deviceMap.set(deviceType, {
          type: deviceType,
          firstInteraction: touchpoint.timestamp,
          lastInteraction: touchpoint.timestamp,
          touchpoints: []
        })
      }
      
      const device = deviceMap.get(deviceType)
      device.lastInteraction = touchpoint.timestamp
      device.touchpoints.push({
        channel: this.getChannelName(touchpoint.channelId),
        interaction: touchpoint.interaction,
        timestamp: touchpoint.timestamp
      })
    })
    
    return Array.from(deviceMap.values()).sort((a, b) => 
      new Date(a.firstInteraction) - new Date(b.firstInteraction)
    )
  }

  inferDeviceType(touchpoint, index) {
    // Simple device inference based on interaction patterns
    const mobileInteractions = ['app_install', 'push_notification', 'sms_click']
    const desktopInteractions = ['email_click', 'form_submit', 'download']
    const tabletInteractions = ['video_view', 'social_share']
    
    if (mobileInteractions.includes(touchpoint.interaction)) {
      return 'mobile'
    } else if (desktopInteractions.includes(touchpoint.interaction)) {
      return 'desktop'
    } else if (tabletInteractions.includes(touchpoint.interaction)) {
      return 'tablet'
    }
    
    // Random assignment for demonstration
    const devices = ['desktop', 'mobile', 'tablet', 'smart_tv', 'wearable']
    const weights = [0.4, 0.35, 0.15, 0.07, 0.03] // Probability weights
    
    let random = Math.random()
    for (let i = 0; i < devices.length; i++) {
      random -= weights[i]
      if (random <= 0) return devices[i]
    }
    
    return 'desktop'
  }

  getChannelName(channelId) {
    const channels = {
      1: 'Google Ads',
      2: 'Facebook Ads', 
      3: 'Instagram Ads',
      4: 'LinkedIn Ads',
      5: 'YouTube Ads',
      6: 'Email Marketing',
      7: 'Organic Search',
      8: 'Direct Traffic'
    }
    return channels[channelId] || 'Unknown'
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const journeys = await this.getJourneys()
    const journey = journeys.find(j => j.Id === parseInt(id))
    if (!journey) {
      throw new Error('Journey not found')
    }
    return { ...journey }
  }

  async getByCustomer(customerId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const journeys = await this.getJourneys()
    return journeys.filter(j => j.customerId === customerId)
  }

  async getDeviceTransitionFlow(timeRange = '7d') {
    await new Promise(resolve => setTimeout(resolve, 450))
    
    const journeys = await this.getJourneys('all', timeRange)
    const transitions = new Map()
    
    journeys.forEach(journey => {
      for (let i = 0; i < journey.devices.length - 1; i++) {
        const from = journey.devices[i].type
        const to = journey.devices[i + 1].type
        const key = `${from}->${to}`
        
        transitions.set(key, (transitions.get(key) || 0) + 1)
      }
    })
    
    return Object.fromEntries(transitions)
  }
}

export const crossDeviceService = new CrossDeviceService()