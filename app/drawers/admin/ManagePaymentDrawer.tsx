import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, AlertTriangle, ExternalLink } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store'
import { setCloseAdminManagePaymentDrawer } from '../../redux/features/adminSlice'
import { formatDateShort } from '@/app/lib/utils'

const ManagePaymentDrawer = () => {
  const dispatch = useAppDispatch()
  const { adminManagePaymentDrawer, subscription } = useAppSelector((state: RootState) => state.admin)

  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'history'>('overview')
  const onClose = () => dispatch(setCloseAdminManagePaymentDrawer())

  if (!subscription) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
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
                      <p className="text-sm text-gray-600">{subscription?.user?.email}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Status Alert */}
                {subscription?.status === 'past_due' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800">Payment is past due - immediate attention required</span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <nav className="flex space-x-8">
                  {[{ key: 'overview', label: 'Overview', icon: CreditCard }].map((tab) => {
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
                          <span className="ml-2 font-medium">{formatDateShort(subscription.currentPeriodEnd)}</span>
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
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ManagePaymentDrawer
