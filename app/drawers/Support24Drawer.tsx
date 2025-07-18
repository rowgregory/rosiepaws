'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Phone,
  MessageCircle,
  Video,
  Clock,
  Heart,
  Stethoscope,
  Shield,
  ExternalLink,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  Globe
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseSupport24Dropdown } from '../redux/features/appSlice'

const Support24Drawer = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    urgency: '',
    description: '',
    contactMethod: 'phone'
  })
  const { support24Drawer } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseSupport24Dropdown())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Handle success - redirect to contact or show confirmation
    }, 2000)
  }

  const services = [
    {
      id: 'emergency',
      title: 'Emergency Consultation',
      description: 'Immediate assistance for urgent pet health concerns',
      icon: Phone,
      color: 'bg-red-500',
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      available: '24/7',
      response: '< 5 min'
    },
    {
      id: 'telehealth',
      title: 'Telehealth Session',
      description: 'Video consultation with Sea Legs veterinarians',
      icon: Video,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      available: '8 AM - 8 PM',
      response: '< 15 min'
    },
    {
      id: 'chat',
      title: 'Live Chat Support',
      description: 'Text-based support for general questions',
      icon: MessageCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      available: '24/7',
      response: '< 2 min'
    }
  ]

  const urgencyLevels = [
    { id: 'emergency', label: 'Emergency', color: 'bg-red-500 text-white', description: 'Life-threatening condition' },
    { id: 'urgent', label: 'Urgent', color: 'bg-orange-500 text-white', description: 'Needs attention today' },
    { id: 'routine', label: 'Routine', color: 'bg-blue-500 text-white', description: 'General question or advice' }
  ]

  return (
    <AnimatePresence>
      {support24Drawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">24/7 Veterinary Support</h2>
                    <p className="text-teal-100 text-sm">Sea Legs Veterinary Care</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Live Status */}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online Now</span>
                <span className="text-teal-100 text-sm">• Avg response: 3 minutes</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedService ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* About Sea Legs */}
                  <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Sea Legs Veterinary</h3>
                        <p className="text-sm text-teal-700">Compassionate care for life&apos;s journey</p>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Sea Legs specializes in palliative and rehabilitative care, helping pets and families navigate
                      health challenges with dignity and comfort.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-teal-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-4 h-4 text-teal-600" />
                          <span className="text-sm font-medium text-gray-900">Licensed</span>
                        </div>
                        <p className="text-xs text-gray-600">Board-certified veterinarians</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-teal-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">5.0 Rating</span>
                        </div>
                        <p className="text-xs text-gray-600">1,200+ reviews</p>
                      </div>
                    </div>

                    <motion.a
                      href="https://sealegsvet.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      Visit sealegsvet.com
                      <ExternalLink className="w-3 h-3" />
                    </motion.a>
                  </div>

                  {/* Service Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How can we help today?</h3>
                    <div className="space-y-3">
                      {services.map((service) => (
                        <motion.button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${service.bgColor} hover:shadow-md`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                            >
                              <service.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{service.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span className={service.textColor}>Available {service.available}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span className={service.textColor}>Response {service.response}</span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 mt-2" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Contact</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="font-medium text-gray-900">(617) 655-9255</p>
                          <p className="text-sm text-gray-600">24/7 Emergency Line</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">info@sealegsvet.com</p>
                          <p className="text-sm text-gray-600">General inquiries</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Nationwide Service</p>
                          <p className="text-sm text-gray-600">Telehealth available in all 50 states</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {/* Back Button */}
                  <button
                    onClick={() => setSelectedService(null)}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    ← Back to services
                  </button>

                  {/* Selected Service Form */}
                  <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {services.find((s) => s.id === selectedService)?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Please provide details about your pet&apos;s situation
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      {/* Urgency Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Urgency Level *</label>
                        <div className="space-y-2">
                          {urgencyLevels.map((level) => (
                            <motion.label
                              key={level.id}
                              whileHover={{ scale: 1.01 }}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                formData.urgency === level.id
                                  ? 'border-teal-500 bg-teal-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="urgency"
                                value={level.id}
                                checked={formData.urgency === level.id}
                                onChange={(e) => setFormData((prev) => ({ ...prev, urgency: e.target.value }))}
                                className="hidden"
                              />
                              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${level.color}`}>
                                {level.label}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{level.description}</p>
                              </div>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Describe your pet&apos;s situation *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                          placeholder="Please describe symptoms, duration, and any recent changes in behavior or appetite..."
                          required
                        />
                      </div>

                      {/* Contact Method */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred contact method</label>
                        <div className="grid grid-cols-2 gap-3">
                          <label
                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                              formData.contactMethod === 'phone' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="contactMethod"
                              value="phone"
                              checked={formData.contactMethod === 'phone'}
                              onChange={(e) => setFormData((prev) => ({ ...prev, contactMethod: e.target.value }))}
                              className="hidden"
                            />
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">Phone Call</span>
                          </label>
                          <label
                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                              formData.contactMethod === 'video' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="contactMethod"
                              value="video"
                              checked={formData.contactMethod === 'video'}
                              onChange={(e) => setFormData((prev) => ({ ...prev, contactMethod: e.target.value }))}
                              className="hidden"
                            />
                            <Video className="w-4 h-4" />
                            <span className="text-sm font-medium">Video Call</span>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !formData.urgency || !formData.description}
                        whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
                        whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
                        className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Stethoscope className="w-4 h-4" />
                            Connect with Veterinarian
                          </>
                        )}
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Support24Drawer
