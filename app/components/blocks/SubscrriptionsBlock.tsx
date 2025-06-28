'use client'

import React from 'react'
import { motion } from 'framer-motion'

const subscriptionTiers = [
  {
    title: 'Comfort',
    price: '23',
    features: [
      'Track daily health data (pain, water, food)',
      'Single pet management',
      'Access from any device',
      'Interactive health charts and insights'
    ]
  },
  {
    title: 'Companion',
    price: '32',
    features: [
      'Everything in Comfort',
      'Triple pet management',
      'Track appointments with personalized email reminders',
      'Exportable data',
      'Priority support'
    ],
    popular: true
  },
  {
    title: 'Legacy',
    price: '45',
    features: [
      'Everything in Companion',
      'Track blood sugar and seizures with video uploads',
      'Unlimited pet management',
      'Generate exportable health reports'
    ]
  }
]

const PricingCard = ({ tier, index }: any) => {
  const isPopular = tier.popular

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`${index === 1 ? 'h-[620px] z-10' : 'h-[580px]'} ${index === 0 && '-mr-3'} ${index === 2 && '-ml-3'} relative bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:z-20 flex flex-col justify-between ${
        isPopular ? 'border-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-gradient-to-br' : 'border-gray-200'
      }`}
      style={{
        background: isPopular ? 'linear-gradient(135deg, #fef2f2, #fdf2f8, #fff7ed)' : 'white'
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <span className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            Popular
          </span>
        </motion.div>
      )}
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <div
              className={`p-2 rounded-lg ${isPopular ? 'bg-gradient-to-r from-red-500 via-pink-500 to-orange-500' : 'bg-gray-100'}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-6 h-6 ${isPopular ? 'text-white' : 'text-gray-600'}`}
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C22.1 9 23 9.9 23 11C23 12.1 22.1 13 21 13C19.9 13 19 12.1 19 11C19 9.9 19.9 9 21 9ZM3 9C4.1 9 5 9.9 5 11C5 12.1 4.1 13 3 13C1.9 13 1 12.1 1 11C1 9.9 1.9 9 3 9ZM19.5 15.5C20.6 15.5 21.5 16.4 21.5 17.5C21.5 18.6 20.6 19.5 19.5 19.5C18.4 19.5 17.5 18.6 17.5 17.5C17.5 16.4 18.4 15.5 19.5 15.5ZM4.5 15.5C5.6 15.5 6.5 16.4 6.5 17.5C6.5 18.6 5.6 19.5 4.5 19.5C3.4 19.5 2.5 18.6 2.5 17.5C2.5 16.4 3.4 15.5 4.5 15.5ZM12 11C13.93 11 15.5 12.57 15.5 14.5C15.5 16.43 13.93 18 12 18C10.07 18 8.5 16.43 8.5 14.5C8.5 12.57 10.07 11 12 11Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 ml-3">{tier.title}</h3>
          </motion.div>

          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
          >
            <span className="text-gray-600 text-lg">$</span>
            <span className="text-6xl font-bold text-gray-800">{tier.price}</span>
            <span className="text-gray-600 text-lg ml-1">/mo</span>
          </motion.div>

          <motion.p
            className="text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            Perfect for pet parents who want comprehensive health tracking and care management.
          </motion.p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {tier.features.map((feature: any, featureIndex: any) => (
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 + featureIndex * 0.1 }}
              className="flex items-start"
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5`}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-800">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700 text-sm ml-3 leading-relaxed">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>
      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.8 }}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center group ${
          isPopular
            ? 'bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Get Started
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>
    </motion.div>
  )
}

const SubscrriptionsBlock = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Select the perfect plan for your pet&apos;s health journey. All plans include our core health tracking
            features.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="max-w-[1320px] mx-auto flex flex-col lg:flex-row items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {subscriptionTiers.map((tier, index) => (
            <PricingCard key={tier.title} tier={tier} index={index} />
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-gray-600 mb-6">
            All plans include a 7-day free trial. All plans include a 7-day free trial. Credit card required for
            automatic billing after trial.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-green-500">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </span>
            <span className="flex items-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-green-500">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payments
            </span>
            <span className="flex items-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-green-500">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              24/7 support
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SubscrriptionsBlock
