import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import ChannelPerformanceChart from '@/components/organisms/ChannelPerformanceChart'
import ConversionTrendChart from '@/components/organisms/ConversionTrendChart'
import CampaignTable from '@/components/organisms/CampaignTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { channelService } from '@/services/api/channelService'
import { campaignService } from '@/services/api/campaignService'
import { conversionService } from '@/services/api/conversionService'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalConversions: 0,
    avgRoas: 0,
    totalSpend: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const [channels, campaigns, conversions] = await Promise.all([
        channelService.getAll(),
        campaignService.getAll(),
        conversionService.getAll()
      ])

      // Calculate metrics
      const totalRevenue = conversions.reduce((sum, c) => sum + c.revenue, 0)
      const totalConversions = conversions.length
      const totalSpend = campaigns.reduce((sum, c) => sum + c.budget, 0)
      const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0

      setMetrics({
        totalRevenue,
        totalConversions,
        avgRoas,
        totalSpend
      })
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading variant="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon="DollarSign"
          trend={[45000, 52000, 48000, 61000, 58000, 67000, 72000]}
        />
        <MetricCard
          title="Conversions"
          value={metrics.totalConversions.toLocaleString()}
          change="+8.2%"
          changeType="positive"
          icon="Target"
          trend={[120, 135, 128, 145, 152, 160, 168]}
        />
        <MetricCard
          title="Average ROAS"
          value={`${metrics.avgRoas.toFixed(2)}x`}
          change="+5.1%"
          changeType="positive"
          icon="TrendingUp"
          trend={[2.1, 2.3, 2.2, 2.5, 2.4, 2.7, 2.8]}
        />
        <MetricCard
          title="Total Spend"
          value={`$${metrics.totalSpend.toLocaleString()}`}
          change="+3.8%"
          changeType="positive"
          icon="CreditCard"
          trend={[18000, 19500, 21000, 22500, 24000, 25500, 26000]}
        />
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelPerformanceChart />
        <ConversionTrendChart />
      </motion.div>

      {/* Campaign Table */}
      <motion.div variants={itemVariants}>
        <CampaignTable />
      </motion.div>
    </motion.div>
  )
}

export default Dashboard