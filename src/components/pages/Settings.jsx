import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import { toast } from 'react-toastify'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('integrations')
  const [integrations, setIntegrations] = useState([
    {
      Id: 1,
      name: 'Google Ads',
      type: 'advertising',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      icon: 'Search'
    },
    {
      Id: 2,
      name: 'Facebook Ads',
      type: 'advertising',
      status: 'connected',
      lastSync: '2024-01-15T10:25:00Z',
      icon: 'Users'
    },
    {
      Id: 3,
      name: 'Google Analytics',
      type: 'analytics',
      status: 'connected',
      lastSync: '2024-01-15T10:20:00Z',
      icon: 'BarChart'
    },
    {
      Id: 4,
      name: 'Shopify',
      type: 'ecommerce',
      status: 'disconnected',
      lastSync: null,
      icon: 'ShoppingCart'
    },
    {
      Id: 5,
      name: 'LinkedIn Ads',
      type: 'advertising',
      status: 'error',
      lastSync: '2024-01-14T15:00:00Z',
      icon: 'Briefcase'
    }
  ])

  const [settings, setSettings] = useState({
    attributionWindow: 30,
    defaultModel: 'last-touch',
    timezone: 'UTC',
    currency: 'USD',
    notifications: {
      email: true,
      slack: false,
      weekly: true,
      alerts: true
    }
  })

  const tabs = [
    { id: 'integrations', name: 'Integrations', icon: 'Plug' },
    { id: 'attribution', name: 'Attribution', icon: 'GitBranch' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'account', name: 'Account', icon: 'User' }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'connected': 'success',
      'disconnected': 'default',
      'error': 'danger',
      'syncing': 'warning'
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const handleConnect = (integrationId) => {
    setIntegrations(integrations.map(integration => 
      integration.Id === integrationId 
        ? { ...integration, status: 'connected', lastSync: new Date().toISOString() }
        : integration
    ))
    toast.success('Integration connected successfully')
  }

  const handleDisconnect = (integrationId) => {
    setIntegrations(integrations.map(integration => 
      integration.Id === integrationId 
        ? { ...integration, status: 'disconnected', lastSync: null }
        : integration
    ))
    toast.success('Integration disconnected')
  }

  const handleSync = (integrationId) => {
    setIntegrations(integrations.map(integration => 
      integration.Id === integrationId 
        ? { ...integration, status: 'syncing', lastSync: new Date().toISOString() }
        : integration
    ))
    
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.Id === integrationId 
          ? { ...integration, status: 'connected' }
          : integration
      ))
      toast.success('Sync completed successfully')
    }, 2000)
  }

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">
          Settings
        </h2>
        <p className="text-slate-600 mt-1">
          Configure your tracking preferences and integrations
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                        <ApperIcon name={integration.icon} className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-semibold text-slate-900">
                          {integration.name}
                        </h3>
                        <p className="text-sm text-slate-600 capitalize">
                          {integration.type}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>

                  {integration.lastSync && (
                    <p className="text-sm text-slate-600 mb-4">
                      Last sync: {new Date(integration.lastSync).toLocaleString()}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleSync(integration.Id)}
                        >
                          <ApperIcon name="RefreshCw" size={16} />
                          Sync
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(integration.Id)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleConnect(integration.Id)}
                      >
                        <ApperIcon name="Link" size={16} />
                        Connect
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'attribution' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-display font-semibold text-slate-900 mb-6">
                Attribution Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attribution Window (days)
                  </label>
                  <Input
                    type="number"
                    value={settings.attributionWindow}
                    onChange={(e) => setSettings({
                      ...settings,
                      attributionWindow: parseInt(e.target.value)
                    })}
                    min="1"
                    max="90"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Attribution Model
                  </label>
                  <select
                    value={settings.defaultModel}
                    onChange={(e) => setSettings({
                      ...settings,
                      defaultModel: e.target.value
                    })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="first-touch">First Touch</option>
                    <option value="last-touch">Last Touch</option>
                    <option value="linear">Linear</option>
                    <option value="time-decay">Time Decay</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      timezone: e.target.value
                    })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">Greenwich Mean Time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({
                      ...settings,
                      currency: e.target.value
                    })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="primary" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-slate-900 mb-6">
              Notification Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                  <p className="text-sm text-slate-600">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: !settings.notifications.email
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.email ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Slack Notifications</h4>
                  <p className="text-sm text-slate-600">Send alerts to Slack channel</p>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      slack: !settings.notifications.slack
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.slack ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.slack ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Weekly Reports</h4>
                  <p className="text-sm text-slate-600">Automated weekly performance summary</p>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      weekly: !settings.notifications.weekly
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.weekly ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.weekly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Performance Alerts</h4>
                  <p className="text-sm text-slate-600">Get notified when metrics exceed thresholds</p>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      alerts: !settings.notifications.alerts
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.alerts ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.alerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="primary" onClick={handleSaveSettings}>
                Save Preferences
              </Button>
            </div>
          </Card>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-display font-semibold text-slate-900 mb-6">
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  defaultValue="Marketing Team"
                  placeholder="Enter company name"
                />
                <Input
                  label="Contact Email"
                  type="email"
                  defaultValue="team@example.com"
                  placeholder="Enter email address"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  placeholder="Enter phone number"
                />
                <Input
                  label="Website"
                  type="url"
                  defaultValue="https://example.com"
                  placeholder="Enter website URL"
                />
              </div>
              
              <div className="mt-6">
                <Button variant="primary" onClick={handleSaveSettings}>
                  Update Account
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-display font-semibold text-slate-900 mb-6">
                Subscription
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Current Plan</p>
                  <p className="text-sm text-slate-600">Premium Plan - $99/month</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex space-x-3">
                  <Button variant="primary">Upgrade Plan</Button>
                  <Button variant="secondary">Billing History</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Settings