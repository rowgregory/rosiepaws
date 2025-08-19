'use client'

import React from 'react'
import PricingCard from '../components/home/PricingCard'
import { plans } from '@/public/data/home.data'
import SubscriptionPlan from '../components/guardian/SubscriptionPlan'
import { ArrowLeftFromLine, Check, X, BarChart3, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { RootState, useAppSelector } from '../redux/store'
import SubscriptionManagementModal from '../modals/SubscriptionManagementModal'
import { motion } from 'framer-motion'
import { planFeatures } from '../lib/constants'
import { formatDate } from '../lib/utils'

const Buy = () => {
  const { user } = useAppSelector((state: RootState) => state.user)

  return (
    <>
      <SubscriptionManagementModal />
      <div className="min-h-dvh">
        {/* Header */}
        <div>
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

        <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
          {/* Current Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-20"
          >
            {user?.stripeSubscription?.cancelAtPeriodEnd && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-amber-100 rounded-full">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900 mb-1">Subscription Cancellation Scheduled</h4>
                      <p className="text-amber-800 text-sm mb-2">
                        Your {user.isComfortUser ? 'Comfort' : 'Legacy'} plan will be canceled on{' '}
                        <span className="font-medium">
                          {formatDate(user.stripeSubscription.currentPeriodEnd, { includeTime: true })}
                        </span>
                        . You&apos;ll continue to have full access until then.
                      </p>
                      <p className="text-amber-700 text-xs">
                        After this date, you&apos;ll be moved to the Free plan with 180 tokens per month.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        /* Handle reactivation */
                      }}
                      className="text-amber-700 hover:text-amber-900 text-sm font-medium"
                    >
                      Reactivate
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            <SubscriptionPlan user={user} />
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-16"
          >
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} user={user} />
            ))}
          </motion.div>

          {/* Feature Comparison */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-16">
            <div className="bg-gray-900 px-8 py-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Feature Comparison</h2>
                  <p className="text-gray-300 text-sm">Detailed plan capabilities overview</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[200px]">Capabilities</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 min-w-[140px]">
                      <div className="text-center">
                        <div className="font-semibold">Free</div>
                        <div className="text-sm text-gray-500 font-normal">$0/month</div>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-blue-600 min-w-[140px]">
                      <div className="text-center">
                        <div className="font-semibold">Comfort</div>
                        <div className="text-sm text-blue-500 font-normal">$10/month</div>
                        <div className="mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Most Popular
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-purple-600 min-w-[140px]">
                      <div className="text-center">
                        <div className="font-semibold">Legacy</div>
                        <div className="text-sm text-purple-500 font-normal">$25/month</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {planFeatures.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {row.free === '✓' ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        ) : row.free === '✗' ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                            <X className="w-4 h-4 text-gray-400" />
                          </div>
                        ) : (
                          <span className="text-gray-600 text-sm font-medium">{row.free}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.comfort === '✓' ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        ) : row.comfort === '✗' ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                            <X className="w-4 h-4 text-gray-400" />
                          </div>
                        ) : (
                          <span className="text-blue-600 text-sm font-semibold">{row.comfort}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.legacy === '✓' ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        ) : row.legacy === '✗' ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                            <X className="w-4 h-4 text-gray-400" />
                          </div>
                        ) : (
                          <span className="text-purple-600 text-sm font-semibold">{row.legacy}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Token Economics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 px-8 py-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Usage-Based Pricing Model</h2>
                    <p className="text-gray-300 text-sm">Transparent pricing aligned with platform utilization</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How Tokens Work</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                        <div>
                          <p className="text-gray-700 font-medium">Basic Health Data Entry</p>
                          <p className="text-gray-600 text-sm">75-90 tokens per entry (pain, feeding, water)</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                        <div>
                          <p className="text-gray-700 font-medium">Medical Monitoring</p>
                          <p className="text-gray-600 text-sm">225-275 tokens per entry (medications, appointments)</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                        <div>
                          <p className="text-gray-700 font-medium">Critical Health Data</p>
                          <p className="text-gray-600 text-sm">400-500 tokens per entry (blood sugar, seizures)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Proposition</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our token-based system ensures you only pay for the features you use while encouraging efficient
                      data management. This model scales with your needs and provides transparent cost control for both
                      individual pet owners and families with multiple pets.
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-900 font-medium text-sm">
                        Free tier: 180 tokens daily. Comfort: 12,000 monthly. Legacy: Unlimited usage.
                      </p>
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
