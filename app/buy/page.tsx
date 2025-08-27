'use client'

import React from 'react'
import PricingCard from '../components/home/PricingCard'
import { plans } from '@/public/data/home.data'
import { useUserSelector } from '../redux/store'
import { motion } from 'framer-motion'
import Header from '../components/buy/Header'
import CurrentSubscription from '../components/buy/CurrentSubscription'
import FeatureComparison from '../components/buy/FeatureComparison'
import TokenEconomics from '../components/buy/TokenEconomics'

const Buy = () => {
  const { user } = useUserSelector()

  return (
    <>
      <div className="min-h-dvh">
        {/* Header */}
        <Header />

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-12">
          {/* Current Subscription */}
          <CurrentSubscription user={user} />

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
          <FeatureComparison />

          {/* Token Economics */}
          <TokenEconomics />
        </div>
      </div>
    </>
  )
}

export default Buy
