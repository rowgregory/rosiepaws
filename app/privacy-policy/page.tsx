'use client'

import { motion } from 'framer-motion'
import { Shield, Heart, Users, Lock, Eye, Mail, Phone, MapPin } from 'lucide-react'

const PrivacyPolicy = () => {
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
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              At Rosie Paws, protecting your privacy and your pet&apos;s information is our top priority. This policy
              explains how we collect, use, and safeguard your data.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-gray-500"
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.div>
          </motion.div>

          {/* Information We Collect */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely)</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pet Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Pet names, breeds, ages, and medical history</li>
                  <li>Vaccination records and health information</li>
                  <li>Behavioral notes and special requirements</li>
                  <li>Photos and videos (with your consent)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Website and app usage patterns</li>
                  <li>Device information and IP addresses</li>
                  <li>Cookies and tracking technologies</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* How We Use Your Information */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Service Delivery</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Provide pet care services and appointments</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Process payments and manage accounts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Send service updates and reminders</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Communication</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Send important service notifications</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Provide customer support</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Share pet care tips and updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Data Security */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Security & Protection</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                <p className="text-sm text-gray-600">
                  All data is encrypted in transit and at rest using industry-standard protocols.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Access Control</h3>
                <p className="text-sm text-gray-600">
                  Strict access controls ensure only authorized personnel can view your information.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Monitoring</h3>
                <p className="text-sm text-gray-600">
                  24/7 security monitoring to detect and prevent unauthorized access.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Your Rights */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights & Choices</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">You have the right to:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Access Your Data</h3>
                    <p className="text-sm text-gray-600">
                      Request a copy of all personal information we have about you
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Correct Information</h3>
                    <p className="text-sm text-gray-600">Update or correct any inaccurate personal information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delete Your Data</h3>
                    <p className="text-sm text-gray-600">
                      Request deletion of your personal information (subject to legal requirements)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Opt-Out</h3>
                    <p className="text-sm text-gray-600">Unsubscribe from marketing communications at any time</p>
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
              <h2 className="text-3xl font-bold mb-4">Questions About Your Privacy?</h2>
              <p className="text-pink-100 max-w-2xl mx-auto">
                We&apos;re here to help! If you have any questions about this privacy policy or how we handle your data,
                please don&apos;t hesitate to reach out to us.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-pink-100">privacy@rosiepaws.com</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-pink-100">(555) 123-PAWS</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <MapPin className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-sm text-pink-100">123 Pet Lane, Care City</p>
              </motion.div>
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
              © {new Date().getFullYear()} Rosie Paws. All rights reserved. Made with ❤️ for pets and their families.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default PrivacyPolicy
