'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle,
  Info,
  Bug,
  HelpCircle,
  CreditCard,
  Settings,
  Upload,
  Paperclip,
  Send
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store'
import { setCloseContactSupporteDrawer } from '../../redux/features/appSlice'
import { clearInputs, createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { UAParser } from 'ua-parser-js'
import { useCreateTicketMutation } from '@/app/redux/services/ticketApi'

const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return null // Return null on server-side
  }

  const parser = new UAParser()
  const result = parser.getResult()
  const screen = window.screen

  return {
    browser: result.browser,
    device: result.device,
    engine: result.engine,
    os: result.os,
    cpu: result.cpu,
    // Additional info
    screenResolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  }
}

const ContactSupportDrawer = () => {
  const [step, setStep] = useState<'category' | 'form' | 'success'>('category')
  const dispatch = useAppDispatch()
  const { contactSupportDrawer } = useAppSelector((state: RootState) => state.app)
  const { ticketForm } = useAppSelector((state: RootState) => state.form)
  const onClose = () => dispatch(setCloseContactSupporteDrawer())
  const { handleInput, handleUploadProgress } = createFormActions('ticketForm', dispatch)
  const [createTicket, { data }] = useCreateTicketMutation()
  const [isLoading, setIsLoading] = useState(false)

  const deviceInfo = getDeviceInfo()

  const categories = [
    {
      id: 'technical',
      title: 'Technical Issue',
      description: 'App bugs, crashes, or technical problems',
      icon: Bug,
      color: 'bg-red-500',
      bgColor: 'bg-red-50 border-red-200',
      examples: ['App crashes', 'Login problems', 'Data not syncing']
    },
    {
      id: 'account',
      title: 'Account & Billing',
      description: 'Account settings, subscriptions, or payments',
      icon: CreditCard,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 border-blue-200',
      examples: ['Billing questions', 'Account access', 'Subscription changes']
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: Settings,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 border-green-200',
      examples: ['New feature ideas', 'UI improvements', 'Integration requests']
    },
    {
      id: 'general',
      title: 'General Support',
      description: 'Questions about using the app',
      icon: HelpCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 border-purple-200',
      examples: ['How-to questions', 'Best practices', 'General guidance']
    }
  ]

  const priorities = [
    {
      id: 'low',
      label: 'Low',
      description: 'General questions, feature requests',
      color: 'bg-gray-500',
      response: '48-72 hours'
    },
    {
      id: 'medium',
      label: 'Medium',
      description: 'Standard issues affecting usage',
      color: 'bg-yellow-500',
      response: '12-24 hours'
    },
    {
      id: 'high',
      label: 'High',
      description: 'Critical issues blocking core functionality',
      color: 'bg-red-500',
      response: '2-6 hours'
    }
  ]

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setInputs({ formName: 'ticketForm', data: { category: categoryId } }))
    setStep('form')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)

    dispatch(
      setInputs({
        formName: 'ticketForm',
        data: {
          attachments: fileArray
        }
      })
    )
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      let uploadedAttachments: string[] = []
      setIsLoading(true)
      // Upload attachments if any exist
      if (ticketForm?.inputs?.attachments && ticketForm?.inputs?.attachments.length > 0) {
        const uploadPromises = ticketForm?.inputs?.attachments.map((file: File) =>
          uploadFileToFirebase(file, handleUploadProgress, 'image')
        )

        uploadedAttachments = await Promise.all(uploadPromises)
      }

      const ticketData = {
        ...ticketForm?.inputs,
        deviceInfo,
        attachments: uploadedAttachments
      }

      await createTicket(ticketData).unwrap()

      setStep('success')
      dispatch(clearInputs({ formName: 'ticketForm' }))
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.id === ticketForm?.inputs?.category)

  function removeAttachment(index: number): void {
    dispatch(
      setInputs({
        formName: 'ticketForm',
        data: {
          attachments: ticketForm?.inputs?.attachments.filter((item: any, itemIndex: number) => itemIndex !== index)
        }
      })
    )
  }

  return (
    <AnimatePresence>
      {contactSupportDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50"
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Contact Support</h2>
                    <p className="text-blue-100 text-sm">We&apos;re here to help you</p>
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

              {/* Progress Steps */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${step === 'category' ? 'text-white' : 'text-blue-200'}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 'category' ? 'bg-white text-blue-600' : 'bg-blue-500'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm">Category</span>
                </div>
                <div className={`w-8 h-0.5 ${step !== 'category' ? 'bg-white' : 'bg-blue-400'}`}></div>
                <div className={`flex items-center gap-2 ${step === 'form' ? 'text-white' : 'text-blue-200'}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 'form' ? 'bg-white text-blue-600' : step === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    {step === 'success' ? <CheckCircle className="w-4 h-4" /> : '2'}
                  </div>
                  <span className="text-sm">Details</span>
                </div>
                <div className={`w-8 h-0.5 ${step === 'success' ? 'bg-white' : 'bg-blue-400'}`}></div>
                <div className={`flex items-center gap-2 ${step === 'success' ? 'text-white' : 'text-blue-200'}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 'success' ? 'bg-white text-blue-600' : 'bg-blue-500'
                    }`}
                  >
                    {step === 'success' ? <CheckCircle className="w-4 h-4" /> : '3'}
                  </div>
                  <span className="text-sm">Complete</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {/* Category Selection */}
                {step === 'category' && (
                  <motion.div
                    key="category"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">How can we help?</h3>
                      <p className="text-gray-600">Select the category that best describes your issue</p>
                    </div>

                    <div className="space-y-4">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${category.bgColor}`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                            >
                              {React.createElement(category.icon, { className: 'w-6 h-6 text-white' })}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{category.title}</h4>
                              <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {category.examples.map((example, index) => (
                                  <span key={index} className="px-2 py-1 bg-white rounded text-xs text-gray-600 border">
                                    {example}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Quick Contact Options */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-4">Need immediate help?</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email Support</p>
                            <p className="text-gray-600 text-sm">support@petcare.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Response Time</p>
                            <p className="text-gray-600 text-sm">Within 24 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Support Form */}
                {step === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => setStep('category')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        ← Back to categories
                      </button>
                    </div>

                    {selectedCategory && (
                      <div className={`p-4 rounded-xl ${selectedCategory.bgColor} mb-6`}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 ${selectedCategory.color} rounded-lg flex items-center justify-center`}
                          >
                            {React.createElement(selectedCategory.icon, { className: 'w-4 h-4 text-white' })}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{selectedCategory.title}</h4>
                            <p className="text-gray-600 text-sm">{selectedCategory.description}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Priority Level</label>
                        <div className="grid grid-cols-3 gap-3">
                          {priorities.map((priority) => (
                            <motion.label
                              key={priority.id}
                              whileHover={{ scale: 1.02 }}
                              className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                                ticketForm?.inputs?.priority === priority.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="priority"
                                value={priority.id}
                                checked={ticketForm?.inputs?.priority === priority.id}
                                onChange={handleInput}
                                className="hidden"
                              />
                              <div className={`w-4 h-4 ${priority.color} rounded-full mx-auto mb-2`}></div>
                              <p className="font-medium text-gray-900 text-sm">{priority.label}</p>
                              <p className="text-xs text-gray-600">{priority.response}</p>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          value={ticketForm?.inputs?.subject || ''}
                          onChange={handleInput}
                          placeholder="Brief description of your issue"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={ticketForm?.inputs?.email || ''}
                          onChange={handleInput}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                          value={ticketForm?.inputs?.description || ''}
                          onChange={handleInput}
                          name="description"
                          placeholder="Please provide detailed information about your issue..."
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          required
                        />
                      </div>

                      {/* File Attachments */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm mb-2">
                            Upload screenshots or files to help us understand your issue
                          </p>
                          <input
                            type="file"
                            multiple
                            name="attachements"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            <Paperclip className="w-4 h-4" />
                            Choose Files
                          </label>
                          <p className="text-xs text-gray-500 mt-2">Max 3 files, 10MB each</p>
                        </div>

                        {/* File List */}
                        {ticketForm?.inputs?.attachments?.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {ticketForm?.inputs?.attachments.map((file: File, index: number) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Paperclip className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Device Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-blue-900 mb-1">System Information</p>
                            <p className="text-blue-800">
                              We&apos;ll automatically include your device and browser information to help diagnose
                              technical issues.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                        whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Support Request
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Support Ticket Created!</h3>
                      <p className="text-gray-600 mb-6">
                        Your support request has been submitted successfully. We&apos;ll get back to you soon.
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Ticket Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Ticket Number:</span>
                          <span className="font-mono text-green-900">{data?.ticket?.id?.slice(0, 10)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Category:</span>
                          <span className="text-green-900">{data?.ticket?.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Priority:</span>
                          <span className="text-green-900 capitalize">{data?.ticket?.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Expected Response:</span>
                          <span className="text-green-900">
                            {priorities.find((p) => p.id === data?.ticket?.priority)?.response}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-blue-800 text-sm">
                        We&apos;ve sent a confirmation email to <strong>{data?.ticket?.email}</strong> with your ticket
                        details.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => {
                          setStep('category')
                          dispatch(clearInputs({ formName: 'ticketForm' }))
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        Submit Another
                      </motion.button>
                      <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ContactSupportDrawer
