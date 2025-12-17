'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, CreditCard, CreditCardIcon } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import ManagePaymentDrawer from '@/app/drawers/admin/ManagePaymentDrawer'
import { setOpenAdminManagePaymentDrawer } from '@/app/redux/features/adminSlice'
import StatusBadge from '@/app/components/admin/subscriptions/StatusBadge'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'
import SubscriptionsStats from '@/app/components/admin/subscriptions/SubscriptionsStats'
import TableHeader from '@/app/components/admin/common/TableHeader'
import {
  SUBSCRIPTION_COLUMNS,
  SUBSCRIPTION_PLAN_OPTIONS,
  SUBSCRIPTION_STATUS_OPTIONS
} from '@/app/lib/constants/admin/subscriptions'
import { formatDateShort } from '@/app/lib/utils/common/dateUtils'
import { subscriptionFilter } from '@/app/lib/utils/admin/subscriptions/filterUtils'
import { formatPrice } from '@/app/lib/utils/common/currencyUtils'
import FilterSearch from '@/app/components/admin/form-elements/FilterSearch'

const AdminSubscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const { subscriptions } = useAppSelector((state: RootState) => state.admin)
  const dispatch = useAppDispatch()

  const filteredSubscriptions = subscriptionFilter(subscriptions, searchTerm, statusFilter, planFilter)

  return (
    <>
      <ManagePaymentDrawer />
      <div className="bg-gray-50 min-h-screen p-6">
        <AdminPageHeader title="Subscription Management" subtitle="Monitor and manage all subscription accounts" />
        <SubscriptionsStats subscriptions={subscriptions} />
        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <FilterSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search by customer name, email, or plan..."
            />

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full"
              >
                {SUBSCRIPTION_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {SUBSCRIPTION_PLAN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader columns={SUBSCRIPTION_COLUMNS} />
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
                          {formatPrice(subscription.planPrice / 100)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">
                          {subscription.currentPeriodEnd ? formatDateShort(subscription.currentPeriodEnd) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">{formatDateShort(subscription.createdAt)}</span>
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
