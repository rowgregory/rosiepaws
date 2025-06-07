'use client'

import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff, Save, X, Check, AlertCircle, Camera, Edit3, Shield } from 'lucide-react'

// Mock user data - replace with actual Redux state
const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com'
}

interface FormData {
  firstName: string
  lastName: string
  email: string
}

const SettingsPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email
  })

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }, 1500)
  }

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrors({ password: 'All password fields are required' })
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: 'New passwords do not match' })
      return
    }
    if (passwordData.newPassword.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' })
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSuccessMessage('Password updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }, 1500)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <>
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">{successMessage}</span>
            </div>
          )}

          {/* Tabs - Mobile Horizontal Scroll, Desktop Grid */}
          <div className="mb-6 sm:mb-8">
            <div className="flex overflow-x-auto sm:grid sm:grid-cols-4 gap-2 pb-2 sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-600 mt-1">Update your personal information and contact details</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                  {isEditing && (
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 mt-1">Change avatar</button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          isEditing
                            ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'border-gray-200 bg-gray-50'
                        } ${errors.firstName ? 'border-red-300' : ''}`}
                      />
                      {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          isEditing
                            ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'border-gray-200 bg-gray-50'
                        } ${errors.lastName ? 'border-red-300' : ''}`}
                      />
                      {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          isEditing
                            ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'border-gray-200 bg-gray-50'
                        } ${errors.email ? 'border-red-300' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your password and security preferences</p>
              </div>

              <div className="space-y-6">
                {/* Change Password */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </div>
                    )}
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SettingsPage
