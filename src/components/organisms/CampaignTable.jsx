import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import SearchBar from '@/components/molecules/SearchBar'
import { campaignService } from '@/services/api/campaignService'
import { channelService } from '@/services/api/channelService'

const CampaignTable = () => {
  const [campaigns, setCampaigns] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('revenue')
  const [sortDirection, setSortDirection] = useState('desc')

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
      setError('Failed to load campaign data')
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

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign => 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getChannelName(campaign.channelId).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const direction = sortDirection === 'asc' ? 1 : -1
      return aVal < bVal ? -direction : aVal > bVal ? direction : 0
    })

  if (loading) return <Loading variant="table" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (campaigns.length === 0) {
    return <Empty title="No campaigns found" description="Start by creating your first marketing campaign" />
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold text-slate-800">
            Campaign Performance
          </h3>
          <Button variant="primary" className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={16} />
            <span>New Campaign</span>
          </Button>
        </div>
        
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search campaigns..."
          className="max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                onClick={() => handleSort('budget')}
              >
                <div className="flex items-center space-x-1">
                  <span>Budget</span>
                  <ApperIcon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                onClick={() => handleSort('conversions')}
              >
                <div className="flex items-center space-x-1">
                  <span>Conversions</span>
                  <ApperIcon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center space-x-1">
                  <span>Revenue</span>
                  <ApperIcon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ROAS
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <AnimatePresence>
              {filteredAndSortedCampaigns.map((campaign) => {
                const roas = campaign.budget > 0 ? (campaign.revenue / campaign.budget).toFixed(2) : '0.00'
                return (
                  <motion.tr
                    key={campaign.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="table-row hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {campaign.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-900">
                        {getChannelName(campaign.channelId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ${campaign.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {campaign.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      ${campaign.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        parseFloat(roas) >= 3 ? 'text-emerald-600' : 
                        parseFloat(roas) >= 2 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {roas}x
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="MoreHorizontal" size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default CampaignTable