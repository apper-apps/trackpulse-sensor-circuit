import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { conversionService } from '@/services/api/conversionService'
import { channelService } from '@/services/api/channelService'

const AttributionFlowChart = () => {
  const [conversions, setConversions] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedModel, setSelectedModel] = useState('last-touch')

  const attributionModels = [
    { id: 'first-touch', name: 'First Touch', description: 'Full credit to first interaction' },
    { id: 'last-touch', name: 'Last Touch', description: 'Full credit to last interaction' },
    { id: 'linear', name: 'Linear', description: 'Equal credit across all touchpoints' },
    { id: 'time-decay', name: 'Time Decay', description: 'More credit to recent interactions' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      await new Promise(resolve => setTimeout(resolve, 400))
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

  const calculateAttribution = () => {
    const attribution = {}
    
    conversions.forEach(conversion => {
      if (!conversion.touchpoints || conversion.touchpoints.length === 0) return
      
      const touchpoints = conversion.touchpoints
      const revenue = conversion.revenue
      
      touchpoints.forEach((touchpoint, index) => {
        const channelName = getChannelName(touchpoint.channelId)
        if (!attribution[channelName]) {
          attribution[channelName] = { revenue: 0, conversions: 0 }
        }
        
        let credit = 0
        
        switch (selectedModel) {
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
        }
        
        attribution[channelName].revenue += revenue * credit
        attribution[channelName].conversions += credit
      })
    })
    
    return Object.entries(attribution)
      .map(([channel, data]) => ({
        channel,
        revenue: Math.round(data.revenue),
        conversions: Math.round(data.conversions * 10) / 10
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const attributionData = calculateAttribution()
  const totalRevenue = attributionData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-slate-800">
          Attribution Analysis
        </h3>
        
        <div className="flex items-center space-x-2">
          {attributionModels.map((model) => (
            <Button
              key={model.id}
              variant={selectedModel === model.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedModel(model.id)}
            >
              {model.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-slate-600">
          {attributionModels.find(m => m.id === selectedModel)?.description}
        </p>
      </div>

      <div className="space-y-4">
        {attributionData.map((item, index) => {
          const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue * 100) : 0
          
          return (
            <motion.div
              key={item.channel}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="w-4 h-4 text-primary-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    {item.channel}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-slate-900">
                      ${item.revenue.toLocaleString()}
                    </span>
                    <Badge variant="primary" size="sm">
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className="bg-gradient-primary rounded-full h-2"
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    {item.conversions} conv
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {attributionData.length === 0 && (
        <div className="text-center py-8">
          <ApperIcon name="GitBranch" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No attribution data available</p>
        </div>
      )}
    </Card>
  )
}

export default AttributionFlowChart