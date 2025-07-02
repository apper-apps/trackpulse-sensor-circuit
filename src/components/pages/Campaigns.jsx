import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import FilterSelect from '@/components/molecules/FilterSelect'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { campaignService } from '@/services/api/campaignService'
import { channelService } from '@/services/api/channelService'
import { toast } from 'react-toastify'

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChannels, setSelectedChannels] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const [campaignData, channelData] = await Promise.all([
        campaignService.getAll(),
        channelService.getAll()
      ])
      
      setCampaigns(campaignData)
      setChannels(channelData)
    } catch (err) {
      setError('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const getChannelName = (channelId) => {
    const channel = channels.find(c => c.Id === channelId)
    return channel ? channel.name : 'Unknown'
  }

  const getStatusBadge = (status) => {
    const variants = {
      'active': 'success',
      'paused': 'warning',
      'ended': 'default'
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      const campaign = campaigns.find(c => c.Id === campaignId)
      if (!campaign) return

      await campaignService.update(campaignId, { ...campaign, status: newStatus })
      setCampaigns(campaigns.map(c => 
        c.Id === campaignId ? { ...c, status: newStatus } : c
      ))
      toast.success(`Campaign ${newStatus} successfully`)
    } catch (err) {
      toast.error('Failed to update campaign status')
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getChannelName(campaign.channelId).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesChannel = selectedChannels.length === 0 || selectedChannels.includes(campaign.channelId.toString())
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(campaign.status)
    
    return matchesSearch && matchesChannel && matchesStatus
  })

  if (loading) return <Loading variant="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  const channelOptions = channels.map(channel => ({
    value: channel.Id.toString(),
    label: channel.name
  }))

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'ended', label: 'Ended' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Campaign Management
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor and optimize your marketing campaigns
          </p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <ApperIcon name="Plus" size={16} />
          <span>Create Campaign</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search campaigns..."
            />
          </div>
          <div className="flex gap-3">
            <FilterSelect
              options={channelOptions}
              selected={selectedChannels}
              onSelectionChange={setSelectedChannels}
              placeholder="Filter by channel"
            />
            <FilterSelect
              options={statusOptions}
              selected={selectedStatuses}
              onSelectionChange={setSelectedStatuses}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </Card>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <Empty 
          title="No campaigns found" 
          description="Create your first campaign to start tracking performance"
          icon="Target"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, index) => {
            const roas = campaign.budget > 0 ? (campaign.revenue / campaign.budget) : 0
            const cpa = campaign.conversions > 0 ? (campaign.budget / campaign.conversions) : 0
            
            return (
              <motion.div
                key={campaign.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-display font-semibold text-slate-900 mb-1">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {getChannelName(campaign.channelId)}
                      </p>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Budget</p>
                      <p className="text-lg font-display font-bold text-slate-900">
                        ${campaign.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Revenue</p>
                      <p className="text-lg font-display font-bold gradient-text">
                        ${campaign.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Conversions</p>
                      <p className="text-lg font-display font-bold text-slate-900">
                        {campaign.conversions}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ROAS</p>
                      <p className={`text-lg font-display font-bold ${
                        roas >= 3 ? 'text-emerald-600' : 
                        roas >= 2 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {roas.toFixed(2)}x
                      </p>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="border-t border-slate-200 pt-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">CPA:</span>
                      <span className="font-medium">${cpa.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-medium">
                        {Math.ceil((new Date(campaign.endDate) - new Date(campaign.startDate)) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      {campaign.status === 'active' && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleStatusChange(campaign.Id, 'paused')}
                        >
                          Pause
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleStatusChange(campaign.Id, 'active')}
                        >
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Campaigns