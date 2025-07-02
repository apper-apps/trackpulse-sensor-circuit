import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { channelService } from '@/services/api/channelService'

const ChannelPerformanceChart = () => {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      setLoading(true)
      setError('')
      await new Promise(resolve => setTimeout(resolve, 300))
      const data = await channelService.getAll()
      setChannels(data)
    } catch (err) {
      setError('Failed to load channel performance data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadChannels} />

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 8,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${(val / 1000).toFixed(0)}k`,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#475569']
      }
    },
    xaxis: {
      categories: channels.map(c => c.name),
      labels: {
        style: {
          fontSize: '12px',
          colors: '#475569'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${(val / 1000).toFixed(0)}k`,
        style: {
          fontSize: '12px',
          colors: '#475569'
        }
      }
    },
    colors: ['#7C3AED'],
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `$${val.toLocaleString()}`
      }
    }
  }

  const chartSeries = [{
    name: 'Revenue',
    data: channels.map(c => c.revenue)
  }]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-slate-800">
          Channel Performance
        </h3>
        <div className="text-sm text-slate-600">
          Revenue by Channel
        </div>
      </div>
      
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={300}
      />
    </Card>
  )
}

export default ChannelPerformanceChart