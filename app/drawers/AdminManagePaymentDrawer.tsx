import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  DollarSign,
  Mail,
  ExternalLink,
  Receipt,
  Zap,
  Slash
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import {
  setCloseAdminConfirmModal,
  setCloseAdminManagePaymentDrawer,
  setOpenAdminConfirmModal
} from '../redux/features/adminSlice'

const AdminManagePaymentDrawer = () => {
  const dispatch = useAppDispatch()
  const { adminManagePaymentDrawer, subscription } = useAppSelector((state: RootState) => state.admin)
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'history'>('overview')
  const onClose = () => dispatch(setCloseAdminManagePaymentDrawer())
  const onCloseConfirmModal = () => dispatch(setCloseAdminConfirmModal())
  if (!subscription) return null

  const handleRetryPayment = async () => {
    try {
      dispatch(
        setOpenAdminConfirmModal({
          confirmModal: {
            isOpen: true,
            title: 'Retry Payment',
            description: `Retrying will attempt to charge the customer’s payment method again by either paying the latest open invoice (for past_due subscriptions) or confirming the latest payment intent (for incomplete subscriptions). If successful, the subscription status will be updated to active`,
            confirmText: 'Retry Payment',
            onConfirm: async () => {
              setIsProcessing(true)
              // Simulate API call to retry payment
              await new Promise((resolve) => setTimeout(resolve, 2000))
              setActionResult({ type: 'success', message: 'Payment retry initiated successfully' })
              onCloseConfirmModal()
              setIsProcessing(false)
            },
            isProcessing
          }
        })
      )
    } catch {
      setActionResult({ type: 'error', message: 'Failed to retry payment' })
    } finally {
      //   setIsProcessing(false)
    }
  }

  const handleUpdatePaymentMethod = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call to send update payment method email
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setActionResult({ type: 'success', message: 'Payment method update email sent to customer' })
    } catch {
      setActionResult({ type: 'error', message: 'Failed to send update email' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRefundLatestPayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call to process refund
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setActionResult({ type: 'success', message: 'Refund processed successfully' })
    } catch {
      setActionResult({ type: 'error', message: 'Failed to process refund' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call to process refund
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setActionResult({ type: 'success', message: 'Subscription cancelled successfully' })
    } catch {
      setActionResult({ type: 'error', message: 'Failed to cancel subscription' })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'N/A'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'past_due':
        return 'text-red-600 bg-red-100'
      case 'canceled':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const mockPaymentHistory = [
    {
      id: 'pi_1',
      amount: subscription.planPrice,
      status: 'succeeded',
      date: '2024-07-01T00:00:00Z',
      description: `${subscription.plan} Plan - Monthly`
    },
    {
      id: 'pi_2',
      amount: subscription.planPrice,
      status: 'failed',
      date: '2024-06-01T00:00:00Z',
      description: `${subscription.plan} Plan - Monthly`
    },
    {
      id: 'pi_3',
      amount: subscription.planPrice,
      status: 'succeeded',
      date: '2024-05-01T00:00:00Z',
      description: `${subscription.plan} Plan - Monthly`
    }
  ]

  return (
    <AnimatePresence>
      {adminManagePaymentDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Manage Payment</h2>
                      <p className="text-sm text-gray-600">{subscription.user.email}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Status Alert */}
                {subscription.status === 'past_due' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800">Payment is past due - immediate attention required</span>
                  </div>
                )}

                {actionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                      actionResult.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {actionResult.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${actionResult.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                      {actionResult.message}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <nav className="flex space-x-8">
                  {[
                    { key: 'overview', label: 'Overview', icon: CreditCard },
                    { key: 'actions', label: 'Actions', icon: Zap },
                    { key: 'history', label: 'Payment History', icon: Receipt }
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Subscription Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(subscription.status)}`}
                          >
                            {subscription.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Plan:</span>
                          <span className="ml-2 font-medium">{subscription.plan}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Monthly Amount:</span>
                          <span className="ml-2 font-medium">{formatCurrency(subscription.planPrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Next Billing:</span>
                          <span className="ml-2 font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded border">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          {subscription.paymentMethodBrand && subscription.paymentMethodLast4 ? (
                            <p className="font-medium capitalize">
                              {subscription.paymentMethodBrand} •••• {subscription.paymentMethodLast4}
                            </p>
                          ) : (
                            <p className="font-medium capitalize">{subscription.paymentMethod?.replace('_', ' ')}</p>
                          )}
                          <p className="text-xs text-gray-500">Primary payment method</p>
                        </div>
                      </div>
                    </div>

                    {/* Stripe Links */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stripe Dashboard</h3>
                      <div className="space-y-2">
                        <a
                          href={`https://dashboard.stripe.com/customers/${subscription.customerId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">View Customer in Stripe</span>
                        </a>
                        {subscription.subscriptionId && (
                          <a
                            href={`https://dashboard.stripe.com/subscriptions/${subscription.subscriptionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm">View Subscription in Stripe</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Actions</h3>

                    {/* Retry Payment */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">Retry Failed Payment</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Attempt to collect payment again using the existing payment method.
                          </p>
                        </div>
                        <button
                          onClick={handleRetryPayment}
                          disabled={isProcessing || subscription.status !== 'past_due'}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                          {isProcessing ? 'Processing...' : 'Retry Payment'}
                        </button>
                      </div>
                    </div>

                    {/* Update Payment Method */}
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">Update Payment Method</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Send an email to the customer with a secure link to update their payment method.
                          </p>
                        </div>
                        <button
                          onClick={handleUpdatePaymentMethod}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          {isProcessing ? 'Sending...' : 'Send Update Link'}
                        </button>
                      </div>
                    </div>

                    {/* Issue Refund */}
                    {/* Issue Refund */}
                    <div className="border border-teal-200 rounded-lg p-4 bg-teal-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">Issue Refund</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Process a refund for the most recent payment. This action cannot be undone.
                          </p>
                        </div>
                        <button
                          onClick={handleRefundLatestPayment}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <DollarSign className="w-4 h-4" />
                          {isProcessing ? 'Processing...' : 'Issue Refund'}
                        </button>
                      </div>
                    </div>

                    {/* Cancel Subscription */}
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">Cancel Subscription</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            This will cancel the subscription at the end of the current billing period. The customer
                            will retain access until then.
                          </p>
                        </div>
                        <button
                          onClick={handleCancelSubscription}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Slash className="w-4 h-4" />
                          {isProcessing ? 'Cancelling...' : 'Cancel Subscription'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                    <div className="space-y-3">
                      {mockPaymentHistory.map((payment) => (
                        <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div
                                  className={`p-1 rounded-full ${
                                    payment.status === 'succeeded' ? 'bg-green-100' : 'bg-red-100'
                                  }`}
                                >
                                  {payment.status === 'succeeded' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                  )}
                                </div>
                                <span
                                  className={`text-sm font-medium ${
                                    payment.status === 'succeeded' ? 'text-green-800' : 'text-red-800'
                                  }`}
                                >
                                  {payment.status === 'succeeded' ? 'Payment Successful' : 'Payment Failed'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{payment.description}</p>
                              <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(payment.amount)}</p>
                              <a
                                href={`https://dashboard.stripe.com/payments/${payment.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                View in Stripe <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AdminManagePaymentDrawer
