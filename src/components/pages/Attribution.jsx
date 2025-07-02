import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import AttributionFlowChart from '@/components/organisms/AttributionFlowChart'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { conversionService } from '@/services/api/conversionService'
import { channelService } from '@/services/api/channelService'

const Attribution = () => {
  const [conversions, setConversions] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedConversion, setSelectedConversion] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const [conversionData, channelData] = await Promise.all([
        conversionService.getAll(),
        channelService.getAll()
      ])
      
      setConversions(conversionData)
      setChannels(channelData)
    } catch (err) {
      setError('Failed to load attribution data')
    } finally {
      setLoading(false)
    }
  }

  const getChannelName = (channelId) => {
    const channel = channels.find(c => c.Id === channelId)
    return channel ? channel.name : 'Unknown'
  }

  const getChannelColor = (channelId) => {
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-yellow-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-green-500'
    ]
    return colors[channelId % colors.length]
  }

  if (loading) return <Loading variant="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Attribution Analysis
          </h2>
          <p className="text-slate-600 mt-1">
            Understand how your marketing channels contribute to conversions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <ApperIcon name="Download" size={16} />
            <span>Export Data</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <ApperIcon name="Settings" size={16} />
            <span>Model Settings</span>
          </Button>
        </div>
      </div>

      {/* Attribution Chart */}
      <AttributionFlowChart />

      {/* Conversion Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-slate-800">
              Recent Conversions
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversions.slice(0, 10).map((conversion, index) => (
              <motion.div
                key={conversion.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedConversion === conversion.Id 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedConversion(conversion.Id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-900">
                    Customer #{conversion.customerId}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    ${conversion.revenue.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {conversion.touchpoints && conversion.touchpoints.map((touchpoint, tIndex) => (
                    <div key={tIndex} className="flex items-center space-x-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        getChannelColor(touchpoint.channelId)
                      }`}>
                        {getChannelName(touchpoint.channelId).charAt(0)}
                      </div>
                      {tIndex < conversion.touchpoints.length - 1 && (
                        <ApperIcon name="ChevronRight" size={12} className="text-slate-400" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-xs text-slate-500">
                  {new Date(conversion.timestamp).toLocaleDateString()} at{' '}
                  {new Date(conversion.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Touchpoint Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-slate-800">
              Touchpoint Analysis
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Filter" size={16} />
            </Button>
          </div>
          
          {selectedConversion ? (
            <div>
              {(() => {
                const conversion = conversions.find(c => c.Id === selectedConversion)
                if (!conversion || !conversion.touchpoints) return null
                
                return (
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600 mb-4">
                      Customer #{conversion.customerId} • ${conversion.revenue.toLocaleString()} revenue
                    </div>
                    
                    {conversion.touchpoints.map((touchpoint, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {getChannelName(touchpoint.channelId)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {touchpoint.interaction}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex-1 text-right">
                          <p className="text-xs text-slate-500">
                            {new Date(touchpoint.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium text-slate-700">
                            Weight: {(touchpoint.weight * 100).toFixed(1)}%
                          </p>
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
                Select a conversion to view its touchpoint analysis
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Attribution