import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import { toast } from 'react-toastify'

const Reports = () => {
  const [reports, setReports] = useState([
    {
      Id: 1,
      name: 'Weekly Performance Report',
      type: 'performance',
      schedule: 'weekly',
      lastRun: '2024-01-15T08:00:00Z',
      status: 'active',
      recipients: 3
    },
    {
      Id: 2,
      name: 'Monthly Attribution Analysis',
      type: 'attribution',
      schedule: 'monthly',
      lastRun: '2024-01-01T09:00:00Z',
      status: 'active',
      recipients: 5
    },
    {
      Id: 3,
      name: 'Campaign ROI Summary',
      type: 'roi',
      schedule: 'bi-weekly',
      lastRun: '2024-01-08T10:00:00Z',
      status: 'paused',
      recipients: 2
    }
  ])

  const [newReport, setNewReport] = useState({
    name: '',
    type: 'performance',
    schedule: 'weekly',
    recipients: ''
  })

  const [showCreateForm, setShowCreateForm] = useState(false)

  const reportTypes = [
    { value: 'performance', label: 'Performance Report', icon: 'BarChart3' },
    { value: 'attribution', label: 'Attribution Analysis', icon: 'GitBranch' },
    { value: 'roi', label: 'ROI Summary', icon: 'DollarSign' },
    { value: 'conversion', label: 'Conversion Report', icon: 'Target' }
  ]

  const scheduleOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'active': 'success',
      'paused': 'warning',
      'failed': 'danger'
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const getTypeIcon = (type) => {
    const typeConfig = reportTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.icon : 'FileText'
  }

  const handleCreateReport = () => {
    if (!newReport.name.trim()) {
      toast.error('Please enter a report name')
      return
    }

    const report = {
      Id: reports.length + 1,
      ...newReport,
      lastRun: new Date().toISOString(),
      status: 'active',
      recipients: newReport.recipients ? newReport.recipients.split(',').length : 0
    }

    setReports([...reports, report])
    setNewReport({ name: '', type: 'performance', schedule: 'weekly', recipients: '' })
    setShowCreateForm(false)
    toast.success('Report created successfully')
  }

  const handleRunReport = (reportId) => {
    setReports(reports.map(report => 
      report.Id === reportId 
        ? { ...report, lastRun: new Date().toISOString() }
        : report
    ))
    toast.success('Report generated successfully')
  }

  const handleToggleStatus = (reportId) => {
    setReports(reports.map(report => 
      report.Id === reportId 
        ? { ...report, status: report.status === 'active' ? 'paused' : 'active' }
        : report
    ))
    toast.success('Report status updated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Reports & Analytics
          </h2>
          <p className="text-slate-600 mt-1">
            Generate and schedule automated marketing reports
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <ApperIcon name="Download" size={16} />
            <span>Export All</span>
          </Button>
          <Button 
            variant="primary" 
            className="flex items-center space-x-2"
            onClick={() => setShowCreateForm(true)}
          >
            <ApperIcon name="Plus" size={16} />
            <span>New Report</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportTypes.map((type, index) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 cursor-pointer hover:shadow-card-hover transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name={type.icon} className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{type.label}</p>
                  <p className="text-xs text-slate-500">Generate now</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Report Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold text-slate-800">
                Create New Report
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowCreateForm(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Report Name"
                value={newReport.name}
                onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                placeholder="Enter report name"
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Report Type
                </label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Schedule
                </label>
                <select
                  value={newReport.schedule}
                  onChange={(e) => setNewReport({...newReport, schedule: e.target.value})}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {scheduleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Recipients (comma-separated emails)"
                value={newReport.recipients}
                onChange={(e) => setNewReport({...newReport, recipients: e.target.value})}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateReport}>
                Create Report
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Scheduled Reports */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-display font-semibold text-slate-800">
            Scheduled Reports
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reports.map((report, index) => (
                <motion.tr
                  key={report.Id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-3">
                        <ApperIcon name={getTypeIcon(report.type)} className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {report.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {reportTypes.find(t => t.value === report.type)?.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 capitalize">
                    {report.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(report.lastRun).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {report.recipients} recipients
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRunReport(report.Id)}
                      >
                        <ApperIcon name="Play" size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleStatus(report.Id)}
                      >
                        <ApperIcon name={report.status === 'active' ? 'Pause' : 'Play'} size={16} />
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Reports