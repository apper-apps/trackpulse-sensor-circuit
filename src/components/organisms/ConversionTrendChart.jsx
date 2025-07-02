import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { conversionService } from '@/services/api/conversionService'

const ConversionTrendChart = () => {
  const [conversions, setConversions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadConversions()
  }, [])

  const loadConversions = async () => {
    try {
      setLoading(true)
      setError('')
      await new Promise(resolve => setTimeout(resolve, 400))
      const data = await conversionService.getAll()
      setConversions(data)
    } catch (err) {
      setError('Failed to load conversion trend data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadConversions} />

  // Group conversions by date
  const dailyConversions = conversions.reduce((acc, conversion) => {
    const date = new Date(conversion.timestamp).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { count: 0, revenue: 0 }
    }
    acc[date].count += 1
    acc[date].revenue += conversion.revenue
    return acc
  }, {})

  const chartData = Object.entries(dailyConversions)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-30) // Last 30 days

  const chartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: chartData.map(([date]) => new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })),
      labels: {
        style: {
          fontSize: '12px',
          colors: '#475569'
        }
      }
    },
    yaxis: [{
      title: {
        text: 'Conversions',
        style: {
          fontSize: '12px',
          color: '#475569'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#475569'
        }
      }
    }, {
      opposite: true,
      title: {
        text: 'Revenue ($)',
        style: {
          fontSize: '12px',
          color: '#475569'
        }
      },
      labels: {
        formatter: (val) => `$${(val / 1000).toFixed(0)}k`,
        style: {
          fontSize: '12px',
          colors: '#475569'
        }
      }
    }],
    colors: ['#10B981', '#7C3AED'],
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  }

  const chartSeries = [
    {
      name: 'Conversions',
      type: 'area',
      data: chartData.map(([, data]) => data.count)
    },
    {
      name: 'Revenue',
      type: 'line',
      data: chartData.map(([, data]) => data.revenue)
    }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-slate-800">
          Conversion Trends
        </h3>
        <div className="text-sm text-slate-600">
          Last 30 Days
        </div>
      </div>
      
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={300}
      />
    </Card>
  )
}

export default ConversionTrendChart