import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import MetricCard from '@/components/molecules/MetricCard'
import { crossDeviceService } from '@/services/api/crossDeviceService'
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters'
import { toast } from 'react-toastify'

const CrossDeviceTracking = () => {
  const [journeys, setJourneys] = useState([])
  const [deviceMetrics, setDeviceMetrics] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedJourney, setSelectedJourney] = useState(null)
  const [deviceFilter, setDeviceFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadData()
  }, [deviceFilter, timeRange])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const [journeyData, metricsData] = await Promise.all([
        crossDeviceService.getJourneys(deviceFilter, timeRange),
        crossDeviceService.getDeviceMetrics(timeRange)
      ])
      
      setJourneys(journeyData)
      setDeviceMetrics(metricsData)
    } catch (err) {
      setError('Failed to load cross-device tracking data')
      toast.error('Error loading device tracking data')
    } finally {
      setLoading(false)
    }
  }

  const getDeviceIcon = (device) => {
    const icons = {
      desktop: 'Monitor',
      mobile: 'Smartphone',
      tablet: 'Tablet',
      smart_tv: 'Tv',
      wearable: 'Watch'
    }
    return icons[device] || 'Monitor'
  }

  const getDeviceColor = (device) => {
    const colors = {
      desktop: 'bg-blue-500',
      mobile: 'bg-emerald-500',
      tablet: 'bg-purple-500',
      smart_tv: 'bg-orange-500',
      wearable: 'bg-pink-500'
    }
    return colors[device] || 'bg-slate-500'
  }

  const deviceTypes = ['all', 'desktop', 'mobile', 'tablet', 'smart_tv', 'wearable']
  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ]

  if (loading) return <Loading variant="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Cross-Device Tracking
          </h2>
          <p className="text-slate-600 mt-1">
            Analyze customer journeys across multiple devices and touchpoints
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <ApperIcon name="Download" size={16} />
            <span>Export Journey Data</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <ApperIcon name="Settings" size={16} />
            <span>Tracking Settings</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Device Filter
            </label>
            <div className="flex flex-wrap gap-2">
              {deviceTypes.map((device) => (
                <button
                  key={device}
                  onClick={() => setDeviceFilter(device)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    deviceFilter === device
                      ? 'bg-primary-100 text-primary-700 border-primary-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                  } border`}
                >
                  <div className="flex items-center space-x-1">
                    {device !== 'all' && (
                      <ApperIcon name={getDeviceIcon(device)} size={14} />
                    )}
                    <span className="capitalize">{device === 'all' ? 'All Devices' : device}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Device Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Cross-Device Conversions"
          value={formatNumber(deviceMetrics.crossDeviceConversions || 0)}
          change={deviceMetrics.crossDeviceConversionsGrowth || 0}
          icon="Smartphone"
          trend={[45, 52, 48, 61, 55, 67, 73]}
        />
        <MetricCard
          title="Avg. Devices per Journey"
          value={formatNumber(deviceMetrics.avgDevicesPerJourney || 0, 1)}
          change={deviceMetrics.avgDevicesGrowth || 0}
          icon="Monitor"
          trend={[2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.8]}
        />
        <MetricCard
          title="Mobile-to-Desktop Rate"
          value={formatPercentage((deviceMetrics.mobileToDesktopRate || 0) / 100)}
          change={deviceMetrics.mobileToDesktopGrowth || 0}
          icon="ArrowRight"
          trend={[34, 38, 35, 42, 39, 45, 47]}
        />
        <MetricCard
          title="Cross-Device Revenue"
          value={formatCurrency(deviceMetrics.crossDeviceRevenue || 0)}
          change={deviceMetrics.crossDeviceRevenueGrowth || 0}
          icon="DollarSign"
          trend={[12500, 13200, 12800, 14100, 13900, 15200, 16800]}
        />
      </div>

      {/* Journey Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Journeys */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-slate-800">
              Recent Cross-Device Journeys
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {journeys.slice(0, 10).map((journey, index) => (
              <motion.div
                key={journey.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedJourney === journey.Id 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedJourney(journey.Id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-900">
                    Customer #{journey.customerId}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={journey.isConverted ? 'success' : 'secondary'}>
                      {journey.isConverted ? 'Converted' : 'In Progress'}
                    </Badge>
                    {journey.isConverted && (
                      <span className="text-sm font-bold text-emerald-600">
                        {formatCurrency(journey.revenue)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  {journey.devices && journey.devices.map((device, dIndex) => (
                    <div key={dIndex} className="flex items-center space-x-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                        getDeviceColor(device.type)
                      }`}>
                        <ApperIcon name={getDeviceIcon(device.type)} size={14} />
                      </div>
                      {dIndex < journey.devices.length - 1 && (
                        <ApperIcon name="ArrowRight" size={12} className="text-slate-400" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-slate-500">
                  Journey started: {new Date(journey.startTime).toLocaleDateString()}
                  {journey.isConverted && (
                    <span className="ml-2">
                      • Duration: {Math.round((new Date(journey.endTime) - new Date(journey.startTime)) / (1000 * 60 * 60))}h
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Journey Details */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-slate-800">
              Journey Details
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Filter" size={16} />
            </Button>
          </div>
          
          {selectedJourney ? (
            <div>
              {(() => {
                const journey = journeys.find(j => j.Id === selectedJourney)
                if (!journey || !journey.devices) return null
                
                return (
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600 mb-4">
                      Customer #{journey.customerId} • {journey.devices.length} devices
                      {journey.isConverted && (
                        <span className="ml-2 text-emerald-600 font-medium">
                          • {formatCurrency(journey.revenue)} revenue
                        </span>
                      )}
                    </div>
                    
                    {journey.devices.map((device, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <ApperIcon name={getDeviceIcon(device.type)} size={18} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 capitalize">
                              {device.type}
                            </p>
                            <p className="text-xs text-slate-500">
                              {device.touchpoints?.length || 0} touchpoints
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              First: {new Date(device.firstInteraction).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              Last: {new Date(device.lastInteraction).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2">
                            {device.touchpoints && device.touchpoints.slice(0, 3).map((tp, tpIndex) => (
                              <div key={tpIndex} className="text-xs text-slate-600 flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                <span>{tp.channel} - {tp.interaction}</span>
                              </div>
                            ))}
                            {device.touchpoints && device.touchpoints.length > 3 && (
                              <div className="text-xs text-slate-500 mt-1">
                                +{device.touchpoints.length - 3} more touchpoints
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="MousePointer" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">
                Select a customer journey to view cross-device details
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Device Transition Flow */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-slate-800">
            Device Transition Flow
          </h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Maximize2" size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Download" size={16} />
            </Button>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="Smartphone" className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Device Flow Visualization</p>
            <p className="text-sm text-slate-500">
              Interactive flow chart showing how customers move between devices during their journey
            </p>
            <Button variant="primary" className="mt-4">
              <ApperIcon name="Play" size={16} className="mr-2" />
              Load Flow Chart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CrossDeviceTracking