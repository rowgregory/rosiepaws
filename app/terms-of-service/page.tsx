'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  Heart,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle,
  Calendar,
  CreditCard,
  PawPrint
} from 'lucide-react'

export default function TermsOfServicePage() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const iconVariants: any = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              variants={iconVariants}
              className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FileText className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Welcome to Rosie Paws! These terms govern your use of our pet care services and platform. By using our
              services, you agree to these terms and conditions.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-gray-500"
            >
              Effective Date: {new Date().toLocaleDateString()} | Version 2.1
            </motion.div>
          </motion.div>

          {/* Quick Overview */}
          <motion.section
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="text-center mb-8">
              <PawPrint className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Here&apos;s what you need to know about using Rosie Paws services in simple terms.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Safe & Caring</h3>
                <p className="text-sm text-blue-100">
                  We provide professional pet care with your pet&apos;s safety as our priority
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flexible Booking</h3>
                <p className="text-sm text-blue-100">
                  Easy scheduling with clear cancellation and rescheduling policies
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Protected</h3>
                <p className="text-sm text-blue-100">Fully insured services with transparent pricing and billing</p>
              </div>
            </div>
          </motion.section>

          {/* Service Agreement */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <PawPrint className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Service Agreement</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Services Include:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Pet sitting and boarding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Dog walking and exercise</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Pet grooming and hygiene</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Veterinary coordination</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Pet transportation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Emergency pet care</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Pet training sessions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Health monitoring</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Service Requirements</h4>
                    <p className="text-sm text-yellow-700">
                      All pets must be up-to-date on vaccinations and provide medical records. Aggressive or unsafe
                      animals may be refused service for safety reasons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Booking & Cancellation */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Booking & Cancellation Policy</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Guidelines</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">24-Hour Advance Booking</p>
                      <p className="text-sm text-gray-600">Most services require at least 24 hours notice</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Meet & Greet Required</p>
                      <p className="text-sm text-gray-600">First-time clients must schedule an initial consultation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Service Confirmation</p>
                      <p className="text-sm text-gray-600">
                        You&apos;ll receive confirmation within 2 hours of booking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Terms</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-medium text-green-800">Free Cancellation</p>
                    <p className="text-sm text-green-700">Cancel up to 24 hours before service with no fee</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="font-medium text-yellow-800">Late Cancellation</p>
                    <p className="text-sm text-yellow-700">12-24 hours: 50% service fee applies</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="font-medium text-red-800">Same-Day Cancellation</p>
                    <p className="text-sm text-red-700">Less than 12 hours: Full service fee charged</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Payment & Pricing */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment & Pricing</h2>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center"
                >
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                  <p className="text-sm text-gray-600">
                    All payments processed through encrypted, PCI-compliant systems
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
                  <p className="text-sm text-gray-600">
                    No hidden fees - you&apos;ll know exactly what you&apos;re paying upfront
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center"
                >
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Flexible Billing</h3>
                  <p className="text-sm text-gray-600">Choose from one-time payments or convenient recurring billing</p>
                </motion.div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Terms</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                        <span>Payment due at time of booking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                        <span>Major credit cards and digital wallets accepted</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                        <span>Automatic billing available for recurring services</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>Late payment fees may apply after 7 days</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>Refunds processed within 5-7 business days</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>Disputed charges handled through secure process</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Liability & Insurance */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Liability & Insurance</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">We&apos;re Fully Insured</h3>
                    <p className="text-green-700 mb-3">
                      Rosie Paws carries comprehensive liability insurance and bonding for all our services and staff
                      members.
                    </p>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• General liability coverage up to $2M</li>
                      <li>• Professional liability insurance</li>
                      <li>• All staff bonded and background checked</li>
                      <li>• Emergency veterinary care coverage</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Responsibilities</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Provide accurate pet medical information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Disclose any behavioral issues or special needs</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Ensure pets are up-to-date on vaccinations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Provide emergency contact information</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      While we take every precaution, pet care involves inherent risks. Our liability is limited to the
                      direct cost of services provided. We recommend maintaining your own pet insurance for
                      comprehensive coverage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.section
            variants={itemVariants}
            className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="text-pink-100 max-w-2xl mx-auto">
                We&apos;re here to help clarify any questions about our terms of service. Don&apos;t hesitate to reach
                out - we want you to feel completely comfortable with our agreement.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-pink-100">legal@rosiepaws.com</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-pink-100">(555) 123-PAWS</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <MapPin className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Office Visit</h3>
                <p className="text-sm text-pink-100">123 Pet Lane, Care City</p>
              </motion.div>
            </div>
          </motion.section>

          {/* Agreement Notice */}
          <motion.section variants={itemVariants} className="bg-gray-900 rounded-2xl p-8 text-white">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <h2 className="text-2xl font-bold mb-4">Agreement Acknowledgment</h2>
              <p className="text-gray-300 max-w-3xl mx-auto mb-6">
                By using Rosie Paws services, you acknowledge that you have read, understood, and agree to be bound by
                these Terms of Service. These terms may be updated periodically, and continued use constitutes
                acceptance of any changes.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <span>Last updated: {new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>Version 2.1</span>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="bg-gray-900 text-white py-8 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Rosie Paws</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Rosie Paws. All rights reserved. Made with ❤️ for pets and their families.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
