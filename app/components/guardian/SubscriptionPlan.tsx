import React from 'react'
import { Crown, Calendar, CreditCard, User, HelpCircle, Zap } from 'lucide-react'

const tokenItems = (tokens: number) => [
  {
    icon: <Zap className="w-4 h-4" />,
    label: 'Fast Tokens',
    value: tokens,
    total: tokens,
    hasInfo: true
  }
]

const SubscriptionPlan = ({ user }: { user: any }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-lg grid grid-cols-2 mb-14">
        {/* Header Section */}
        <div className="border-r-1 border-r-border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 font-medium">My Plan</span>
            </div>
            <span className="text-purple-600 font-semibold">{user.stripeSubscription?.plan || 'Free'}</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 text-sm">Billing Period</span>
            </div>
            <span className="text-gray-600 text-sm">Monthly</span>
          </div>

          {!user.isFreeUser && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">Next Payment</span>
              </div>
              <span className="text-gray-600 text-sm">24/07/25</span>
            </div>
          )}
          {/* Bottom Buttons */}
          <div className="flex gap-3 justify-between">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors w-fit">
              <User className="w-4 h-4" />
              Manage Subscription
            </button>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </button>
          </div>
        </div>

        <div className="border-l-1 border-l-transparent p-4 flex justify-between flex-col">
          {tokenItems(user.tokens).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-gray-500">{item.icon}</div>
                <span className="text-gray-600 text-sm">{item.label}</span>
                {item.hasInfo && <HelpCircle className="w-3 h-3 text-gray-400" />}
              </div>
              <div className="text-right">
                {item.value !== null && (
                  <span className="text-gray-600 text-sm">
                    {item.total ? `${item.value} / ${item.total}` : item.value}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Upgrade Button */}
          <div className="flex justify-end">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105">
              ✨ Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlan
