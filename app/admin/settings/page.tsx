'use client'

import { useState } from 'react'
import { Save, CreditCard, Check, DollarSign, Calendar, Heart, Crown, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const AdminSettings = () => {
  // Subscription Plan Settings
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    trialDuration: 7,
    basicPlanPrice: 23,
    premiumPlanPrice: 34,
    professionalPlanPrice: 42
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
    setSubscriptionSettings((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-full mx-auto space-y-8">
        {/* Settings Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden"
        >
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-7 h-7 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
            </div>
            <p className="text-gray-600 mt-2">
              Manage trial duration and pricing for all Rosie Paws subscription tiers
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Trial Duration */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Free Trial Period</h3>
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 min-w-fit">Trial Duration:</label>
                <div className="relative max-w-32">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={subscriptionSettings.trialDuration}
                    onChange={(e) => updateSetting('trialDuration', parseInt(e.target.value))}
                    className="w-full px-4 py-2 pr-12 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    days
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Users get {subscriptionSettings.trialDuration} days free access to all features
                </p>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscription Pricing</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Plan */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 relative">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Basic Paws</h4>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={subscriptionSettings.basicPlanPrice}
                        onChange={(e) => updateSetting('basicPlanPrice', parseFloat(e.target.value))}
                        className="pl-10 w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-4 mt-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Crown className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Premium Paws</h4>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={subscriptionSettings.premiumPlanPrice}
                        onChange={(e) => updateSetting('premiumPlanPrice', parseFloat(e.target.value))}
                        className="pl-10 w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Plan */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200 relative">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Sparkles className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Professional Paws</h4>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={subscriptionSettings.professionalPlanPrice}
                        onChange={(e) => updateSetting('professionalPlanPrice', parseFloat(e.target.value))}
                        className="pl-10 w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-xl font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Changes will affect all new subscriptions immediately.</p>
                  <p>Existing subscribers will see changes at their next billing cycle.</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-semibold transition-all transform ${
                    saved
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white hover:scale-105'
                  } ${isSaving ? 'opacity-50 cursor-not-allowed scale-100' : 'shadow-lg hover:shadow-xl'}`}
                >
                  {saved ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Settings Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminSettings
