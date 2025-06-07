'use client'

import React, { useState } from 'react'
import {
  Check,
  X,
  CreditCard,
  Calendar,
  AlertTriangle,
  Crown,
  Shield,
  Zap,
  Heart,
  Activity,
  Bell,
  FileText,
  Users,
  ArrowRight
} from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'

// Mock user data - replace with actual Redux state
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'premium_user', // or 'basic_user'
  subscription: {
    plan: 'Premium',
    status: 'active',
    nextBillingDate: '2025-07-07',
    amount: 35.0,
    currency: 'USD',
    interval: 'monthly'
  }
}

const plans = {
  basic: {
    name: 'Basic',
    price: 23.0,
    interval: 'monthly',
    description: 'Essential pet care tracking',
    features: [
      'Track up to 1 pet',
      'Basic health monitoring',
      'Pain Scoring',
      'Track feedings',
      'Water Intake',
      'Medications'
    ],
    icon: Shield,
    color: 'indigo'
  },
  premium: {
    name: 'Premium',
    price: 35.0,
    interval: 'monthly',
    description: 'Complete pet care solution',
    features: [
      'Everything in basic',
      'Unlimited pets',
      'Priority customer support',
      'Blood Sugar Tracking',
      'Seizure Tracking',
      'Data export & backup'
    ],
    icon: Crown,
    color: 'purple'
  }
}

const SubscriptionPage = () => {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { pets, painScoreCount, bloodSugarCount, seizureCount } = useAppSelector((state: RootState) => state.pet)

  const currentPlan = mockUser.role === 'premium_user' ? plans.premium : plans.basic
  // const otherPlan = mockUser.role === 'premium_user' ? plans.basic : plans.premium
  const isBasicUser = mockUser.role === 'basic_user'
  const isPremiumUser = mockUser.role === 'premium_user'

  const handlePlanChange = async (action: 'upgrade' | 'downgrade' | 'cancel') => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      if (action === 'cancel') setShowCancelModal(false)
      if (action === 'upgrade') setShowUpgradeModal(false)
      // Handle success/error states here
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      {/* Mobile/Desktop Container */}
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Subscription</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your pet care subscription and billing</p>
          </div>

          {/* Current Subscription Card - Mobile/Desktop Responsive */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${currentPlan.color}-100 flex items-center justify-center`}
                >
                  <currentPlan.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${currentPlan.color}-600`} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{currentPlan.name} Plan</h2>
                  <p className="text-sm sm:text-base text-gray-600 hidden sm:block">{currentPlan.description}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium self-start ${
                  mockUser.subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {mockUser.subscription.status.charAt(0).toUpperCase() + mockUser.subscription.status.slice(1)}
              </div>
            </div>

            {/* Mobile Description - Show on mobile only */}
            <p className="text-sm text-gray-600 mb-4 sm:hidden">{currentPlan.description}</p>

            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Monthly Cost</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    ${mockUser.subscription.amount}/month
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Next Billing</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {formatDate(mockUser.subscription.nextBillingDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Pet Limit</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {isPremiumUser ? 'Unlimited' : '2 pets'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Stack, Desktop Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isBasicUser && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Premium
                </button>
              )}
              {isPremiumUser && (
                <button
                  onClick={() => handlePlanChange('downgrade')}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
                >
                  <Shield className="w-4 h-4" />
                  {loading ? 'Processing...' : 'Downgrade to Basic'}
                </button>
              )}
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-red-200 text-red-600 px-4 py-3 sm:py-2 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm sm:text-base"
              >
                <X className="w-4 h-4" />
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Plan Comparison - Mobile Stack, Desktop Grid */}
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 mb-6 sm:mb-8">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 p-4 sm:p-6 ${
                  (key === 'basic' && isBasicUser) || (key === 'premium' && isPremiumUser)
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-${plan.color}-100 flex items-center justify-center`}
                  >
                    <plan.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${plan.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-sm sm:text-base text-gray-600">/{plan.interval}</span>
                </div>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {((key === 'basic' && isBasicUser) || (key === 'premium' && isPremiumUser)) && (
                  <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 text-center">
                    <p className="text-xs sm:text-sm font-medium text-purple-700">Current Plan</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Usage Stats - Mobile 2x2, Desktop 4x1 */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Your Usage</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{pets?.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Active Pets</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{painScoreCount}</p>
                <p className="text-xs sm:text-sm text-gray-600">Pain Scores</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{bloodSugarCount}</p>
                <p className="text-xs sm:text-sm text-gray-600">Blood Sugar Readings</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-xl">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{seizureCount}</p>
                <p className="text-xs sm:text-sm text-gray-600">Seizure episodes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal - Mobile/Desktop Responsive */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                <p className="text-xs sm:text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-6">
              Are you sure you want to cancel your subscription? You&apos;ll lose access to all premium features at the
              end of your current billing period on {formatDate(mockUser.subscription.nextBillingDate)}.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => handlePlanChange('cancel')}
                disabled={loading}
                className="w-full px-4 py-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal - Mobile/Desktop Responsive */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upgrade to Premium</h3>
                <p className="text-xs sm:text-sm text-gray-600">Unlock all premium features</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm sm:text-base text-gray-700">Monthly cost increase:</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">+$20.00</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Immediate access to all premium features
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-medium text-gray-900">You&apos;ll get access to:</p>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  Unlimited pets (currently limited to 2)
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  Advanced health analytics & insights
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  Vet appointment scheduling
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  Priority customer support
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Maybe Later
              </button>
              <button
                onClick={() => handlePlanChange('upgrade')}
                disabled={loading}
                className="w-full px-4 py-3 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Upgrading...' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SubscriptionPage
