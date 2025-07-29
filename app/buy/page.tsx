'use client'

import React from 'react'
import PricingCard from '../components/home/PricingCard'
import { plans } from '@/public/data/home.data'
import SubscriptionPlan from '../components/guardian/SubscriptionPlan'
import { ArrowLeftFromLine, Check, Coins, Crown, X, Shield, Star } from 'lucide-react'
import Link from 'next/link'
import { RootState, useAppSelector } from '../redux/store'
import SubscriptionManagementModal from '../modals/SubscriptionManagementModal'
import { motion } from 'framer-motion'
import { planFeatures } from '../lib/constants'
import {
  comfortTierName,
  comfortTierPrice,
  companionTierName,
  companionTierPrice,
  freeTierName,
  freeTierPrice,
  legacyTierName,
  legacyTierPrice
} from '../lib/constants/public/token'

const Buy = () => {
  const { user } = useAppSelector((state: RootState) => state.user)

  return (
    <>
      <SubscriptionManagementModal />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link
              href="/guardian/home"
              className="inline-flex items-center gap-3 text-slate-600 hover:text-pink-500 transition-colors duration-300 group"
            >
              <ArrowLeftFromLine className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-xl font-bold">
                <span className="text-slate-800">Rosie</span>
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  .Paws
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Choose Your Perfect Plan
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Professional Pet Care
              <span className="block text-transparent bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive health tracking and personalized care recommendations for your beloved companion
            </p>
          </motion.div>

          {/* Current Subscription */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SubscriptionPlan user={user} />
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-16"
          >
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} user={user} />
            ))}
          </motion.div>

          {/* Feature Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Feature Comparison</h2>
                    <p className="text-slate-300">Compare all plans side by side</p>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 min-w-[200px]">Features</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-600 min-w-[120px]">
                        <div className="flex flex-col items-center">
                          <span>{freeTierName}</span>
                          <span className="text-sm font-normal text-slate-500 mt-1">${freeTierPrice}/month</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-blue-600 min-w-[120px]">
                        <div className="flex flex-col items-center">
                          <span>{comfortTierName}</span>
                          <span className="text-sm font-normal text-blue-500 mt-1">${comfortTierPrice}/month</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-purple-600 min-w-[120px]">
                        <div className="flex flex-col items-center">
                          <span>{companionTierName}</span>
                          <span className="text-sm font-normal text-purple-500 mt-1">${companionTierPrice}/month</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-amber-600 min-w-[120px]">
                        <div className="flex flex-col items-center">
                          <span>{legacyTierName}</span>
                          <span className="text-sm font-normal text-amber-500 mt-1">${legacyTierPrice}/month</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {planFeatures.map((row, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-slate-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">{row.feature}</td>
                        <td className="px-6 py-4 text-center">
                          {row.free === '✓' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                          ) : row.free === '✗' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                              <X className="w-5 h-5 text-red-500" />
                            </div>
                          ) : (
                            <span className="text-slate-600 font-medium">{row.free}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.comfort === '✓' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                          ) : row.comfort === '✗' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                              <X className="w-5 h-5 text-red-500" />
                            </div>
                          ) : (
                            <span className="text-blue-600 font-semibold">{row.comfort}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.companion === '✓' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                          ) : row.companion === '✗' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                              <X className="w-5 h-5 text-red-500" />
                            </div>
                          ) : (
                            <span className="text-purple-600 font-semibold">{row.companion}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.legacy === '✓' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                          ) : row.legacy === '✗' ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                              <X className="w-5 h-5 text-red-500" />
                            </div>
                          ) : (
                            <span className="text-amber-600 font-semibold">{row.legacy}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Token Economics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Token Economics</h2>
                    <p className="text-emerald-100">Understanding our value-based pricing model</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Why Token Limits?</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Token limits encourage thoughtful health tracking while preventing system overload. They help
                          prioritize the most important health metrics for your pet, ensuring you focus on what matters
                          most for their wellbeing.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl shrink-0">
                        <Star className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Value-Based Pricing</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Higher token costs for critical health data reflect their importance and the advanced
                          processing required for accurate tracking, analysis, and personalized care recommendations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Benefits */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Premium Quality</h4>
                      <p className="text-sm text-slate-600">Advanced health insights and tracking</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Secure & Private</h4>
                      <p className="text-sm text-slate-600">Your pet&apos;s data is always protected</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">24/7 Support</h4>
                      <p className="text-sm text-slate-600">Expert help whenever you need it</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Buy
