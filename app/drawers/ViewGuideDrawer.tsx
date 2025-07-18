'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  PawPrint,
  User,
  Weight,
  Calendar,
  Heart,
  Stethoscope,
  Phone,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  Star,
  Shield,
  Camera,
  Home,
  Clock
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseViewGuideeDrawer } from '../redux/features/appSlice'

const ViewGuideDrawer = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const dispatch = useAppDispatch()
  const { viewGuideDrawer } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseViewGuideeDrawer())

  const steps = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      icon: User,
      color: 'bg-blue-500',
      description: "Start with your pet's essential details",
      fields: [
        { name: 'Pet Name', example: 'Max', required: true, description: "Choose a name that's easy to call" },
        { name: 'Pet Type', example: 'Dog or Cat', required: true, description: 'Select the type of pet you have' },
        {
          name: 'Breed',
          example: 'Golden Retriever',
          required: false,
          description: 'Help us provide breed-specific advice'
        }
      ]
    },
    {
      id: 'physical-details',
      title: 'Physical Details',
      icon: Weight,
      color: 'bg-green-500',
      description: 'Important details for health tracking',
      fields: [
        {
          name: 'Age',
          example: '3 years, 2 months',
          required: false,
          description: 'Helps track age-related health needs'
        },
        { name: 'Weight', example: '45 lbs', required: false, description: 'Important for medication dosing' },
        { name: 'Gender', example: 'Male/Female', required: false, description: 'Helps with health recommendations' },
        {
          name: 'Spayed/Neutered',
          example: 'Yes/No/Unknown',
          required: false,
          description: 'Affects health considerations'
        }
      ]
    },
    {
      id: 'health-info',
      title: 'Health Information',
      icon: Stethoscope,
      color: 'bg-red-500',
      description: 'Medical details for better care',
      fields: [
        {
          name: 'Microchip ID',
          example: '982000123456789',
          required: false,
          description: 'For identification if lost'
        },
        { name: 'Known Allergies', example: 'Chicken, pollen', required: false, description: 'Critical for safety' },
        {
          name: 'Current Medications',
          example: 'Rimadyl 75mg daily',
          required: false,
          description: 'Track ongoing treatments'
        }
      ]
    },
    {
      id: 'emergency-contact',
      title: 'Emergency Contact',
      icon: Phone,
      color: 'bg-purple-500',
      description: 'Backup care information',
      fields: [
        {
          name: 'Contact Name',
          example: 'Jane Smith',
          required: false,
          description: 'Someone who can care for your pet'
        },
        { name: 'Contact Phone', example: '(555) 123-4567', required: false, description: 'Emergency backup contact' }
      ]
    },
    {
      id: 'additional-notes',
      title: 'Additional Notes',
      icon: FileText,
      color: 'bg-orange-500',
      description: 'Special information about your pet',
      fields: [
        {
          name: 'Special Notes',
          example: 'Loves belly rubs, afraid of thunderstorms',
          required: false,
          description: 'Personality traits and important behaviors'
        }
      ]
    }
  ]

  const benefits = [
    {
      icon: Heart,
      title: 'Personalized Care',
      description: "Get health recommendations tailored to your pet's specific needs and breed"
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Keep important medical information accessible for emergencies'
    },
    {
      icon: Camera,
      title: 'Photo Gallery',
      description: "Upload and organize photos and videos of your pet's precious moments"
    },
    {
      icon: Calendar,
      title: 'Health Tracking',
      description: 'Monitor symptoms, medications, and daily activities over time'
    },
    {
      icon: Home,
      title: 'Veterinarian Info',
      description: "Store your vet's contact information for quick access"
    },
    {
      icon: Clock,
      title: 'Care Reminders',
      description: 'Never miss medications, appointments, or important care tasks'
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AnimatePresence>
      {viewGuideDrawer && (
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
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <PawPrint className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Pet Profile Setup Guide</h2>
                    <p className="text-blue-100 text-sm">Learn how to create your pet&apos;s profile</p>
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

              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mb-4">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full flex-1 ${index <= currentStep ? 'bg-white' : 'bg-white/30'}`}
                    initial={false}
                    animate={{
                      backgroundColor: index <= currentStep ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.3)'
                    }}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-blue-100 text-sm">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step Header */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className={`w-16 h-16 ${steps[currentStep].color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      {React.createElement(steps[currentStep].icon, { className: 'w-8 h-8 text-white' })}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h3>
                    <p className="text-gray-600">{steps[currentStep].description}</p>
                  </div>

                  {/* Fields List */}
                  <div className="space-y-4">
                    {steps[currentStep].fields.map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-2">
                            {field.required ? (
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-xs font-bold">*</span>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{field.name}</h4>
                              {field.required && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{field.description}</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">Example:</span> {field.example}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tips for Current Step */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
                        {currentStep === 0 && (
                          <p className="text-blue-800 text-sm">
                            Choose a name that&apos;s 1-2 syllables for easier training. Make sure to select the correct
                            pet type to get species-specific health recommendations.
                          </p>
                        )}
                        {currentStep === 1 && (
                          <p className="text-blue-800 text-sm">
                            Accurate weight is crucial for medication dosing. If you&apos;re unsure of exact age, an
                            estimate like &quot;2-3 years&quot; is perfectly fine.
                          </p>
                        )}
                        {currentStep === 2 && (
                          <p className="text-blue-800 text-sm">
                            Even if fields are optional, filling them out helps us provide better, more personalized
                            care recommendations and safety alerts.
                          </p>
                        )}
                        {currentStep === 3 && (
                          <p className="text-blue-800 text-sm">
                            Having an emergency contact ensures your pet can receive care even when you&apos;re
                            unavailable. Choose someone familiar with your pet.
                          </p>
                        )}
                        {currentStep === 4 && (
                          <p className="text-blue-800 text-sm">
                            Include personality traits, fears, favorite treats, or medical conditions. This helps create
                            a complete picture of your pet&apos;s needs.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                whileHover={{ scale: currentStep > 0 ? 1.02 : 1 }}
                whileTap={{ scale: currentStep > 0 ? 0.98 : 1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {currentStep + 1} of {steps.length}
                </p>
              </div>

              {currentStep < steps.length - 1 ? (
                <motion.button
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => {
                    onClose()
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  <PawPrint className="w-4 h-4" />
                  Start Creating
                </motion.button>
              )}
            </div>

            {/* Benefits Overlay (shown after completing steps) */}
            {currentStep === steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-6 bottom-20 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 shadow-lg"
              >
                <div className="text-center mb-4">
                  <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900">What You&apos;ll Unlock</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {React.createElement(benefit.icon, { className: 'w-4 h-4 text-green-600 flex-shrink-0' })}
                      <span className="text-gray-700">{benefit.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ViewGuideDrawer
