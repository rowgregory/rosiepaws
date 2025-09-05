'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Shield, CheckCircle, Mail, AlertTriangle, Users, Database, Lock, Eye, Download } from 'lucide-react'

const TermsOfService = () => {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These terms govern your use of our pet health tracking platform and services. By creating an account, you
              agree to these terms and conditions.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-gray-500"
            >
              Effective Date: {new Date().toLocaleDateString()} | Version 1.0
            </motion.div>
          </motion.div>

          {/* Quick Overview */}
          <motion.section
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="text-center mb-8">
              <Database className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Here&apos;s what you need to know about using our pet health tracking platform in simple terms.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-blue-100">
                  Your pet&apos;s health data belongs to you and is kept completely private and secure
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Free to Use</h3>
                <p className="text-sm text-blue-100">
                  Core health tracking features are completely free with optional premium resources
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Your Control</h3>
                <p className="text-sm text-blue-100">
                  Export, edit, or delete your data anytime - you&apos;re always in complete control
                </p>
              </div>
            </div>
          </motion.section>

          {/* Platform Services */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Platform Services</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Platform Includes:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Pain and symptom tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Medication and treatment logs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Feeding and water intake monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Exercise and movement tracking</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Appointment scheduling and reminders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Vital signs and health monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Educational resources and guides</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Data export for veterinary visits</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Not a Medical Service</h4>
                    <p className="text-sm text-yellow-700">
                      Our platform is a tracking tool only. We do not provide medical advice, diagnosis, or treatment.
                      Always consult your veterinarian for medical decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Data Privacy & Ownership */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Privacy & Ownership</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Data Rights</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Complete Ownership</p>
                      <p className="text-sm text-gray-600">All health data you enter belongs entirely to you</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Access Anytime</p>
                      <p className="text-sm text-gray-600">View, edit, or download your complete data history</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Download className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Easy Export</p>
                      <p className="text-sm text-gray-600">Export data in formats suitable for veterinary visits</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Protection</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-medium text-blue-800">Encrypted Storage</p>
                    <p className="text-sm text-blue-700">All data encrypted in transit and at rest</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-medium text-green-800">No Data Selling</p>
                    <p className="text-sm text-green-700">We never sell or share your pet&apos;s health information</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="font-medium text-purple-800">GDPR Compliant</p>
                    <p className="text-sm text-purple-700">Full compliance with international privacy laws</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Account & Usage */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Account & Usage Terms</h2>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center"
                >
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Free Account</h3>
                  <p className="text-sm text-gray-600">Core health tracking features are completely free to use</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center"
                >
                  <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Resources</h3>
                  <p className="text-sm text-gray-600">
                    Optional paid access to veterinary guides and educational materials
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center"
                >
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Responsible Use</h3>
                  <p className="text-sm text-gray-600">
                    Use platform responsibly and provide accurate health information
                  </p>
                </motion.div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                        <span>Accurate contact information required</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span>Report security issues immediately</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span>Account deletion available on request</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Limitation of Liability */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Important Disclaimer</h3>
                    <p className="text-red-700 mb-3">
                      Our platform is a tracking tool only and does not replace professional veterinary care. We are not
                      liable for medical decisions made based on tracked data.
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Always consult your veterinarian for medical decisions</li>
                      <li>• Emergency situations require immediate veterinary attention</li>
                      <li>• Platform availability not guaranteed 24/7</li>
                      <li>• Data accuracy depends on user input</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Limitations</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Service interruptions may occur for maintenance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Data accuracy depends on user input quality</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Features may be updated or changed over time</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">User Responsibilities</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Users are responsible for the accuracy of health data entered and for consulting veterinary
                      professionals for all medical decisions. The platform serves as a tracking aid only, not a medical
                      diagnostic tool.
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
                out if you need any clarification about how our platform works.
              </p>
            </div>
            <div className="grid md:grid-cols-1 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-pink-100">support@rosiepawsapp.com</p>
              </motion.div>
            </div>
          </motion.section>

          {/* Agreement Notice */}
          <motion.section variants={itemVariants} className="bg-gray-900 rounded-2xl p-8 text-white">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <h2 className="text-2xl font-bold mb-4">Agreement Acknowledgment</h2>
              <p className="text-gray-300 max-w-3xl mx-auto mb-6">
                By creating an account and using our pet health tracking platform, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service. These terms may be updated periodically,
                and continued use constitutes acceptance of any changes.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <span>Last updated: {new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>Version 1.0</span>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  )
}

export default TermsOfService
