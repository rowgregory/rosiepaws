'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useCreateCheckoutSessionMutation } from '../redux/services/stripeApi'
import { useRouter } from 'next/navigation'

const plans = [
  {
    id: 'comfort',
    name: 'Comfort',
    subtitle: 'Perfect for single pet families',
    price: '$23',
    period: '/month',
    description: 'Essential tracking and care for your beloved companion',
    features: [
      'Track 1 pet',
      'Basic health monitoring',
      'Vaccination reminders',
      'Weight tracking',
      'Photo memories (up to 50)',
      'Basic health reports',
      'Email support',
      'Mobile app access'
    ],
    color: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    popular: false
  },
  {
    id: 'companion',
    name: 'Companion',
    subtitle: 'Ideal for multi-pet households',
    price: '$32',
    period: '/month',
    description: 'Comprehensive care for all your furry family members',
    features: [
      'Track up to 3 pets',
      'Advanced health analytics',
      'Medication reminders',
      'Vet appointment scheduling',
      'Unlimited photo memories',
      'Detailed health insights',
      'Priority email support',
      'Family sharing features',
      'Custom health goals',
      'Export health records'
    ],
    color: 'from-orange-400 to-red-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    popular: true
  },
  {
    id: 'legacy',
    name: 'Legacy',
    subtitle: 'For serious pet care enthusiasts',
    price: '$45',
    period: '/month',
    description: 'Premium features for the ultimate pet care experience',
    features: [
      'Unlimited pets',
      'AI-powered health predictions',
      'Telemedicine consultations',
      'DNA & breed analysis integration',
      'Advanced behavior tracking',
      'Personalized care plans',
      '24/7 phone support',
      'Veterinary network access',
      'Health trend analysis',
      'Emergency contact system',
      'Premium memory books',
      'Priority feature requests'
    ],
    color: 'from-purple-400 to-indigo-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    popular: false
  }
]

const SubscriptionsPage = () => {
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation()
  const { push } = useRouter()

  const handlePlanSelect = async (planId: string) => {
    const response = await createCheckoutSession({ planId }).unwrap()
    push(response.url)
  }

  return (
    <div className="h-[calc(100dvh-148px)] bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Choose Your Care Plan</h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Every moment with your pet deserves to be treasured. Select the perfect plan to keep your beloved
              companions healthy, happy, and remembered forever.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-pink-100">7-day free trial • Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: plan.popular ? 1.05 : 1.02,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl border-2 ${plan.borderColor} hover:shadow-2xl transition-all duration-300 ${plan.popular ? 'scale-105 ring-4 ring-orange-200' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, type: 'spring', stiffness: 200 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    🌟 Most Popular
                  </div>
                </motion.div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                    className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}
                  >
                    <motion.svg
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, delay: index * 0.1 + 1, repeat: Infinity, repeatDelay: 3 }}
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </motion.svg>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                    className="text-2xl font-bold text-gray-900 mb-2"
                  >
                    {plan.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                    className={`text-sm ${plan.textColor} font-medium mb-4`}
                  >
                    {plan.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                    className="flex items-baseline justify-center mb-4"
                  >
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                    className="text-gray-600 text-sm"
                  >
                    {plan.description}
                  </motion.p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.05 }}
                      className="flex items-center"
                    >
                      <div
                        className={`w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 bg-gradient-to-r ${plan.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Start ${plan.name} Plan`
                  )}
                </motion.button>

                <p className="text-center text-xs text-gray-500 mt-3">7-day free trial included</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Rosie Paws?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed by pet lovers, for pet lovers. Every feature is crafted with compassion and care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '❤️',
                title: 'Compassionate Care',
                description: 'Track health, behavior, and precious moments with tools designed for loving pet parents.'
              },
              {
                icon: '📊',
                title: 'Smart Insights',
                description: "AI-powered analytics help you understand your pet's needs and health patterns."
              },
              {
                icon: '🏥',
                title: 'Vet Integration',
                description: 'Seamlessly share records with veterinarians and access professional care networks.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'Can I change my plan anytime?',
                answer:
                  'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.'
              },
              {
                question: 'What happens to my data if I cancel?',
                answer:
                  'Your pet data is always yours. We provide export options and keep your data accessible for 30 days after cancellation.'
              },
              {
                question: 'How does family sharing work?',
                answer:
                  "With Companion and Legacy plans, you can invite unlimited family members, friends, or caregivers to access your pet's information. Everyone gets their own login while sharing the same pet profiles and data."
              },
              {
                question: 'How does the free trial work?',
                answer:
                  "Every plan includes a 7-day free trial with full access to all features. After the trial ends, you'll be automatically billed for your chosen plan. You can cancel anytime during the trial with no charges."
              },
              {
                question: 'Is my payment information secure?',
                answer:
                  'Absolutely! We use Stripe for secure payment processing and never store your credit card information on our servers. Your data is encrypted and protected with industry-standard security.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-pink-100 mb-8 text-lg">
              Join thousands of pet parents who trust Rosie Paws to care for their beloved companions.
            </p>
            <div className="text-2xl">🐾</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsPage
