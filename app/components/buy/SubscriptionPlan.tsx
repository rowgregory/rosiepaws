import React from 'react'
import { Crown, Calendar, CreditCard } from 'lucide-react'
import TokensSVG from '@/public/svg/TokensSVG'

const SubscriptionPlan = ({ user }: any) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`
  }

  const getPlanDisplayName = () => {
    if (user?.isFreeUser) return 'Free'
    if (user?.isComfortUser) return 'Comfort'
    if (user?.isLegacyUser) return 'Legacy'
    return user?.stripeSubscription?.plan || 'Free'
  }

  const getPlanBadgeColor = () => {
    if (user?.isFreeUser) return 'bg-gray-100 text-gray-700'
    if (user?.isComfortUser) return 'bg-blue-100 text-blue-700'
    if (user?.isLegacyUser) return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getTokensDisplay = () => {
    if (user?.isLegacyUser) return 'Unlimited'
    return user?.tokens?.toLocaleString() || '0'
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Current Plan</h3>
                <p className="text-sm text-gray-500">Active subscription</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanBadgeColor()}`}>
              {getPlanDisplayName()}
            </div>
          </div>
        </div>

        {/* Plan Details - Compact Horizontal Layout */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Billing Period */}
            <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
              <div className="p-1 bg-white rounded mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-gray-900 font-medium text-xs mb-1">Billing</span>
              <span className="text-gray-700 font-semibold text-sm">{user?.isFreeUser ? 'N/A' : 'Monthly'}</span>
            </div>

            {/* Tokens */}
            <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
              <div className="p-1 bg-white rounded mb-2">
                <TokensSVG color1="#6b7280" color2="#6b7280" id="tokensIcon" />
              </div>
              <span className="text-gray-900 font-medium text-xs mb-1">Tokens</span>
              <div className="text-center">
                <span className="text-gray-700 font-semibold text-sm">{getTokensDisplay()}</span>
                {user?.isLegacyUser && <p className="text-xs text-purple-600">No limits</p>}
              </div>
            </div>

            {/* Pricing */}
            {!user?.isFreeUser && user?.stripeSubscription && (
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
                <div className="p-1 bg-white rounded mb-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-gray-900 font-medium text-xs mb-1">Cost</span>
                <span className="text-gray-700 font-semibold text-sm">
                  {formatPrice(user?.stripeSubscription.planPrice)}
                </span>
              </div>
            )}

            {/* Next Payment */}
            {!user?.isFreeUser && user?.stripeSubscription?.currentPeriodEnd && (
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
                <div className="p-1 bg-white rounded mb-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>

                {/* Check if user cancelled but still has access */}
                {user?.stripeSubscription.cancelAtPeriodEnd ? (
                  <>
                    <span className="text-red-600 font-medium text-xs mb-1">Plan Cancelled</span>
                    <span className="text-gray-700 font-semibold text-sm">
                      Access until {formatDate(user?.stripeSubscription.currentPeriodEnd)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-900 font-medium text-xs mb-1">Next Payment</span>
                    <span className="text-gray-700 font-semibold text-sm">
                      {formatDate(user?.stripeSubscription.currentPeriodEnd)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlan
