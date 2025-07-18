'use client'

import React from 'react'
import PricingCard from '../components/home/PricingCard'
import { plans } from '@/public/data/home.data'
import SubscriptionPlan from '../components/guardian/SubscriptionPlan'
import { ArrowLeftFromLine, Check, Coins, Crown, X } from 'lucide-react'
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
} from '../lib/constants/token'

const Buy = () => {
  const { user } = useAppSelector((state: RootState) => state.user)

  return (
    <>
      <SubscriptionManagementModal />
      <div className="pt-3 bg-zinc-50 min-h-dvh">
        <Link href="/guardian/home" className="w-fit h-10 pl-8 flex items-center gap-x-3 group">
          <ArrowLeftFromLine className="w-5 h-5 group-hover:text-pink-500 duration-300" />
          <span className="text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent font-semibold tracking-wide">
            <span className="text-gray-800">Rosie</span>.Paws
          </span>
        </Link>
        <div className="max-w-[1440px] mx-auto w-full flex items-center flex-col">
          <SubscriptionPlan user={user} />
          <div className="space-y-4 sm:space-y-0 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 sm:gap-3 mb-6 sm:mb-8 px-3">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} user={user} />
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {/* Plan Comparison Chart */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-3 mb-6">
              <Crown className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Plan Comparison</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg border border-purple-100 overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Features</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">
                      {freeTierName}
                      <br />
                      <span className="text-sm font-normal">${freeTierPrice}/month</span>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-blue-600">
                      {comfortTierName}
                      <br />
                      <span className="text-sm font-normal">${comfortTierPrice}/month</span>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-purple-600">
                      {companionTierName}
                      <br />
                      <span className="text-sm font-normal">${companionTierPrice}/month</span>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-yellow-600">
                      {legacyTierName}
                      <br />
                      <span className="text-sm font-normal">${legacyTierPrice}/month</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {planFeatures.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-4 py-3 font-medium text-gray-900">{row.feature}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        {row.free === '✓' ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.free === '✗' ? (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">{row.free}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {row.comfort === '✓' ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.comfort === '✗' ? (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-blue-600 font-medium">{row.comfort}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {row.companion === '✓' ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.companion === '✗' ? (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-purple-600 font-medium">{row.companion}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {row.legacy === '✓' ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.legacy === '✗' ? (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-yellow-600 font-medium">{row.legacy}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Token Economics Explanation */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <Coins className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Token Economics</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <h4 className="font-medium text-gray-900 mb-2">Why Token Limits?</h4>
                <p className="text-sm text-gray-600">
                  Token limits encourage thoughtful health tracking while preventing system overload. They help
                  prioritize the most important health metrics for your pet.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <h4 className="font-medium text-gray-900 mb-2">Value-Based Pricing</h4>
                <p className="text-sm text-gray-600">
                  Higher token costs for critical health data reflect their importance and the advanced processing
                  required for accurate tracking and analysis.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Buy
