'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Save, X, CheckCircle2, Phone, Stethoscope, PhoneCall, Navigation } from 'lucide-react'

const VeterinarianProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    vetName: 'Dr. Sarah Johnson',
    clinicName: 'Happy Paws Veterinary Clinic',
    phone: '(555) 123-4567',
    emergencyPhone: '(555) 987-6543',
    email: 'info@happypawsvet.com',
    address: '123 Main Street, Springfield, IL 62701',
    website: 'https://happypawsvet.com',
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM',
    notes: "Ask for Dr. Johnson specifically. They know our pet's history well."
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      setSuccessMessage('Veterinarian information updated successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    }, 1500)
  }

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`
  }

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(formData.address)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-700">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Veterinarian Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl">
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">My Veterinarian</h2>
                  <p className="text-sm text-gray-600">Manage your veterinarian&apos;s contact information</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Information'}
              </motion.button>
            </div>
          </div>

          <div className="p-6">
            {/* Quick Actions */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                <motion.button
                  onClick={() => handleCall(formData.phone)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-xl">
                    <PhoneCall className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-green-900">Call Clinic</p>
                    <p className="text-sm text-green-700">{formData.phone}</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={handleDirections}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-blue-900">Get Directions</p>
                    <p className="text-sm text-blue-700">Open in Maps</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleCall(formData.emergencyPhone)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-xl">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-red-900">Emergency</p>
                    <p className="text-sm text-red-700">{formData.emergencyPhone}</p>
                  </div>
                </motion.button>
              </motion.div>
            )}

            <div className="space-y-8">
              {/* Veterinarian Information */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Veterinarian Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Veterinarian Name</label>
                    <input
                      type="text"
                      value={formData.vetName}
                      onChange={(e) => handleInputChange('vetName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="Dr. Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Clinic Name</label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => handleInputChange('clinicName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="Happy Paws Veterinary"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Emergency Number</label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="(555) 987-6543"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="info@vetclinic.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="https://vetclinic.com"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Location & Hours */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Location & Hours
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Clinic Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all resize-none ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="123 Main Street, City, State 12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Office Hours</label>
                    <textarea
                      value={formData.hours}
                      onChange={(e) => handleInputChange('hours', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      className={`w-full px-4 py-3 border rounded-xl text-sm transition-all resize-none ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                      placeholder="Mon-Fri: 8:00 AM - 6:00 PM"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Additional Notes
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Notes & Special Instructions</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all resize-none ${
                      isEditing
                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                    placeholder="Any special notes about your veterinarian or clinic preferences..."
                  />
                </div>
              </motion.div>

              {/* Action Buttons */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200"
                  >
                    <motion.button
                      onClick={handleSave}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving Information...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Information
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => setIsEditing(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VeterinarianProfile
