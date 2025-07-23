'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Settings, Check, Bell, Users, AlertCircle, Coins, Heart } from 'lucide-react'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Token Settings
    dailyTokenAllocation: 100,
    tokenResetTime: '00:00',

    // User Management
    maxPetsPerFreeUser: 1,

    // Notifications
    lowTokenWarningThreshold: 20,
    sendWeeklyReports: true,
    maintenanceNotifications: true,

    // System Settings
    enableSystemMaintenance: false,
    backupFrequency: 'daily'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSaved(true)
    setIsSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const SettingCard = ({
    title,
    description,
    children,
    icon: Icon
  }: {
    title: string
    description: string
    children: React.ReactNode
    icon: any
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )

  const ToggleSwitch = ({
    enabled,
    onChange,
    label,
    description
  }: {
    enabled: boolean
    onChange: (value: boolean) => void
    label: string
    description?: string
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-gray-900' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const NumberInput = ({
    value,
    onChange,
    label,
    min = 0,
    max,
    unit,
    description
  }: {
    value: number
    onChange: (value: number) => void
    label: string
    min?: number
    max?: number
    unit?: string
    description?: string
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{unit}</span>}
      </div>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  )

  const SelectInput = ({
    value,
    onChange,
    label,
    options,
    description
  }: {
    value: string
    onChange: (value: string) => void
    label: string
    options: { value: string; label: string }[]
    description?: string
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Configure platform settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 max-w-6xl">
        {/* Token Management */}
        <SettingCard
          title="Token Management"
          description="Configure daily token allocations and usage limits"
          icon={Coins}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <NumberInput
              label="Daily Token Allocation"
              value={settings.dailyTokenAllocation}
              onChange={(value) => updateSetting('dailyTokenAllocation', value)}
              min={10}
              max={1000}
              unit="tokens"
              description="Tokens given to each user daily"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Token Reset Time</label>
              <input
                type="time"
                value={settings.tokenResetTime}
                onChange={(e) => updateSetting('tokenResetTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">When daily tokens reset (UTC time)</p>
            </div>
            <NumberInput
              label="Low Token Warning"
              value={settings.lowTokenWarningThreshold}
              onChange={(value) => updateSetting('lowTokenWarningThreshold', value)}
              min={1}
              max={100}
              unit="tokens"
              description="Show warning when tokens fall below this"
            />
          </div>
        </SettingCard>

        {/* User Management */}
        <SettingCard title="User Management" description="Control user registration and account settings" icon={Users}>
          <NumberInput
            label="Max Pets Per Free User"
            value={settings.maxPetsPerFreeUser}
            onChange={(value) => updateSetting('maxPetsPerFreeUser', value)}
            min={1}
            max={50}
            unit="pets"
            description="Maximum number of pets a free user can register"
          />
        </SettingCard>

        {/* Notification Settings */}
        <SettingCard title="Notifications" description="Configure email and system notifications" icon={Bell}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.sendWeeklyReports}
                onChange={(value) => updateSetting('sendWeeklyReports', value)}
                label="Weekly Reports"
                description="Send weekly usage reports to admins"
              />
            </div>
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.maintenanceNotifications}
                onChange={(value) => updateSetting('maintenanceNotifications', value)}
                label="Maintenance Notifications"
                description="Notify users about system maintenance"
              />
            </div>
          </div>
        </SettingCard>

        {/* System Configuration */}
        <SettingCard
          title="System Configuration"
          description="Core system settings and security options"
          icon={Settings}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SelectInput
              label="Backup Frequency"
              value={settings.backupFrequency}
              onChange={(value) => updateSetting('backupFrequency', value)}
              options={[
                { value: 'hourly', label: 'Every Hour' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' }
              ]}
              description="How often to backup system data"
            />
            <div>
              <ToggleSwitch
                enabled={settings.enableSystemMaintenance}
                onChange={(value) => updateSetting('enableSystemMaintenance', value)}
                label="Maintenance Mode"
                description="Enable maintenance mode for system updates"
              />
            </div>
          </div>
        </SettingCard>

        {/* Current Plan Information */}
        <SettingCard
          title="Subscription Plans"
          description="Current pricing structure (managed by system)"
          icon={Heart}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Comfort Plan</h4>
              <p className="text-2xl font-bold text-green-600 mb-1">$11.99/month</p>
              <p className="text-sm text-gray-600">45,000 tokens included</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Companion Plan</h4>
              <p className="text-2xl font-bold text-purple-600 mb-1">$22.99/month</p>
              <p className="text-sm text-gray-600">120,000 tokens included</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Legacy Plan</h4>
              <p className="text-2xl font-bold text-orange-600 mb-1">$34.99/month</p>
              <p className="text-sm text-gray-600">Unlimited tokens included</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Plan Information</span>
            </div>
            <p className="text-sm text-blue-800">
              Subscription pricing is managed at the system level. Users receive daily tokens based on their plan and
              can purchase additional tokens as needed.
            </p>
          </div>
        </SettingCard>

        {/* Save Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">Save Configuration</p>
              <p>Changes will be applied immediately and affect all users.</p>
              <p>Some settings may require a system restart to take effect.</p>
            </div>
            <motion.button
              onClick={handleSaveSettings}
              disabled={isSaving}
              whileHover={{ scale: isSaving ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                saved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
