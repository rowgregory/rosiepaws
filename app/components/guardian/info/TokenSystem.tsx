import React from 'react'
import { motion } from 'framer-motion'
import { Coins, Crown, Gift, Heart, Sparkles } from 'lucide-react'

const TokenSystem = () => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Coins className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">What Are Tokens?</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Tokens are the currency used in Rosie Paws to track your pet&apos;s health data. Free users receive daily
          tokens, while paid subscribers purchase token packages for their logging needs.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Earn Daily</h4>
            </div>
            <p className="text-sm text-gray-600">Free tier users get free daily tokens</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Critical Care Tracking</h4>
            </div>
            <p className="text-sm text-gray-600">
              Track essential health metrics for disabled and end-of-life pet care
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Specialized Monitoring</h4>
            </div>
            <p className="text-sm text-gray-600">
              Advanced health tracking for complex medical conditions and palliative care
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <Crown className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Token Allocation</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Token Allocation</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded border border-green-100">
                <span className="text-gray-600">Free</span>
                <span className="font-medium text-green-600">750 tokens daily</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border border-green-100">
                <span className="text-gray-600">Comfort</span>
                <span className="font-medium text-blue-600">Token packages</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border border-green-100">
                <span className="text-gray-600">Legacy</span>
                <span className="font-medium text-yellow-600">Unlimited</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Token System</h4>
            <p className="text-gray-600 mb-3">
              Free tokens are replenished daily for free users only. Paid subscribers purchase token packages as needed,
              while Premium users have unlimited access.
            </p>
            <div className="bg-white p-3 rounded border border-green-100">
              <p className="text-sm text-gray-600">
                <strong>Important:</strong> Only free users receive daily token replenishment. Paid tiers purchase
                tokens in packages for flexible usage!
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TokenSystem
