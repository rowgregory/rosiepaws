'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  CreditCard,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCardIcon
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import AdminManagePaymentDrawer from '@/app/drawers/AdminManagePaymentDrawer'
import { setOpenAdminManagePaymentDrawer } from '@/app/redux/features/adminSlice'
import AdminConfirmModal from '@/app/modals/AdminConformModal'

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' }
      case 'past_due':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Past Due' }
      case 'canceled':
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Canceled' }
      case 'incomplete':
        return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Incomplete' }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactive' }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

const AdminSubscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const { subscriptions } = useAppSelector((state: RootState) => state.admin)
  // const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
  const dispatch = useAppDispatch()

  // Calculate summary stats
  const totalSubscriptions = subscriptions?.length || 0
  const activeSubscriptions = subscriptions?.filter((s) => s.status === 'active').length || 0
  const totalMRR =
    subscriptions?.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.planPrice, 0) / 100 || 0
  const avgRevenuePerUser = activeSubscriptions > 0 ? totalMRR / activeSubscriptions : 0

  // Filter subscriptions
  const filteredSubscriptions =
    subscriptions?.filter((subscription) => {
      const matchesSearch =
        subscription.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter
      const matchesPlan = planFilter === 'all' || subscription.plan === planFilter

      return matchesSearch && matchesStatus && matchesPlan
    }) || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj)
  }

  return (
    <>
      <AdminManagePaymentDrawer />
      <AdminConfirmModal />
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
              <p className="text-gray-600">Monitor and manage all subscription accounts</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Subscriptions</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalSubscriptions}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Subscriptions</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monthly Recurring Revenue</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMRR)}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Average Revenue Per User</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgRevenuePerUser)}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, email, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All Plans</option>
              <option value="FREE">Free</option>
              <option value="COMFORT">Comfort</option>
              <option value="COMPANION">Companion</option>
              <option value="LECAGY">Legacy</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredSubscriptions.map((subscription, index) => (
                    <motion.tr
                      key={subscription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{subscription.user?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{subscription.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{subscription.plan}</span>
                          <span className="text-xs text-gray-500">
                            {subscription.tokensIncluded.toLocaleString()} tokens
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={subscription.status} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            {subscription.paymentMethodBrand && subscription.paymentMethodLast4 ? (
                              <span className="capitalize">
                                {subscription.paymentMethodBrand} •••• {subscription.paymentMethodLast4}
                              </span>
                            ) : (
                              <span className="capitalize">
                                {subscription.paymentMethod?.replace('_', ' ') || 'N/A'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(subscription.planPrice / 100)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">
                          {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">{formatDate(subscription.createdAt)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <motion.button
                            onClick={() => dispatch(setOpenAdminManagePaymentDrawer({ subscription }))}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 text-gray-500 hover:text-blue-700 transition-colors"
                          >
                            <CreditCardIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No subscriptions found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSubscriptions
