'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Eye, Lock, Download, Trash2, Edit } from 'lucide-react'

const PrivacyPolicy = () => {
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

  const iconVariants: any = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        duration: 0.8
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
              We&apos;re committed to protecting your privacy and being transparent about how we collect and use your
              information.
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
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Information You Provide Directly</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email address when you create an account or log in using magic link authentication</li>
                  <li>Name, email address, and profile image when you sign in with Google</li>
                  <li>
                    Any additional information you voluntarily provide through contact forms or interactive features
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Information Collected Automatically</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Authentication cookies (JWT tokens) to keep you logged in securely</li>
                  <li>View counts on media resources to show users how many people have viewed each resource</li>
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
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Currently, we collect this information for:</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>To authenticate users and manage secure account access</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>To provide view count statistics to authenticated users</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>To respond to inquiries submitted through our forms</span>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl border border-amber-200"
              >
                <h4 className="font-semibold text-amber-900 mb-2">Future Use</h4>
                <p className="text-amber-800">
                  We may use your information for additional purposes in the future, such as marketing communications or
                  service updates. If we do, we will update this privacy policy and notify you of any significant
                  changes to how we use your data.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Your Rights & Controls */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights & Complete Control</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg font-medium text-gray-900">You have complete control over your personal data:</p>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Access Your Data</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Request a copy of all personal information we have about you in a readable, portable format.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Download Your Data</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Get a complete export of your personal information that you can save or transfer.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Delete Your Data</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Request permanent removal of your data from our systems at any time.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Edit className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Update Information</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Request corrections to any inaccurate personal information we hold about you.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Data Sharing */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Sharing & Protection</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-700">
                We do not currently sell, trade, or share your personal information with third parties, except:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl"
                >
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                  <p className="text-sm text-gray-600">When required by law or legal process</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Protection</h3>
                  <p className="text-sm text-gray-600">To protect our rights, privacy, safety, or property</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
                  <p className="text-sm text-gray-600">
                    With providers who help operate our website (bound by confidentiality)
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Data Security & Retention */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Security & Retention</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no internet transmission is completely secure,
                and we cannot guarantee absolute security.
              </p>
              <p>
                We retain your personal information only as long as necessary for the purposes outlined in this policy
                or as required by law. You can request deletion of your data at any time.
              </p>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-xl mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Authentication Cookies</h4>
                <p className="text-gray-700">
                  We use a single authentication cookie containing a JWT (JSON Web Token) to keep you securely logged in
                  to your account. This cookie is essential for the website&apos;s functionality and cannot be disabled
                  if you want to remain logged in. The JWT contains only necessary session information and expires
                  automatically for your security.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Changes to Policy */}
          <motion.section variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                We may update this privacy policy from time to time. When we do, we will post the updated policy on this
                page, update the &quot;Last updated&quot; date, and notify users of significant changes via email or
                prominent website notice.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  )
}

export default PrivacyPolicy
