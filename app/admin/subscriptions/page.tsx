'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Download,
  MoreVertical,
  User,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  Edit,
  RefreshCw
} from 'lucide-react'

// Sample subscription data
const subscriptionsData = [
  {
    id: 'sub_001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    plan: 'Pro',
    status: 'active',
    amount: 49.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBilling: '2025-07-15',
    startDate: '2024-07-15',
    lastPayment: '2025-06-15',
    paymentMethod: '**** 4242'
  },
  {
    id: 'sub_002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@company.com',
    plan: 'Premium',
    status: 'active',
    amount: 199.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBilling: '2025-07-20',
    startDate: '2023-12-01',
    lastPayment: '2025-06-20',
    paymentMethod: '**** 5555'
  },
  {
    id: 'sub_003',
    customerName: 'Mike Wilson',
    customerEmail: 'mike.wilson@startup.io',
    plan: 'Basic',
    status: 'past_due',
    amount: 19.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBilling: '2025-06-25',
    startDate: '2025-01-10',
    lastPayment: '2025-05-25',
    paymentMethod: '**** 1234'
  },
  {
    id: 'sub_004',
    customerName: 'Emma Davis',
    customerEmail: 'emma.davis@freelance.com',
    plan: 'Pro',
    status: 'cancelled',
    amount: 49.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBilling: null,
    startDate: '2024-03-15',
    lastPayment: '2025-05-15',
    paymentMethod: '**** 9876'
  },
  {
    id: 'sub_005',
    customerName: 'David Brown',
    customerEmail: 'david.brown@agency.com',
    plan: 'Premium',
    status: 'trialing',
    amount: 99.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBilling: '2025-07-30',
    startDate: '2025-06-30',
    lastPayment: null,
    paymentMethod: '**** 6789'
  },
  {
    id: 'sub_006',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@techcorp.com',
    plan: 'Premium',
    status: 'active',
    amount: 1999.99,
    currency: 'USD',
    billingCycle: 'yearly',
    nextBilling: '2026-01-15',
    startDate: '2024-01-15',
    lastPayment: '2025-01-15',
    paymentMethod: '**** 1111'
  }
]

const StatusBadge = ({ status }: any) => {
  const statusConfig: any = {
    active: { color: 'green', icon: CheckCircle, label: 'Active' },
    past_due: { color: 'red', icon: AlertCircle, label: 'Past Due' },
    cancelled: { color: 'gray', icon: XCircle, label: 'Cancelled' },
    trialing: { color: 'blue', icon: Clock, label: 'Trial' },
    paused: { color: 'yellow', icon: Clock, label: 'Paused' }
  }

  const config = statusConfig[status] || statusConfig.active
  const Icon = config.icon

  return (
    <div
      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        config.color === 'green'
          ? 'bg-green-100 text-green-700'
          : config.color === 'red'
            ? 'bg-red-100 text-red-700'
            : config.color === 'blue'
              ? 'bg-blue-100 text-blue-700'
              : config.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
      }`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  )
}

const PlanBadge = ({ plan }: any) => {
  const planColors: any = {
    Basic: 'bg-blue-100 text-blue-700',
    Pro: 'bg-green-100 text-green-700',
    Premium: 'bg-purple-100 text-purple-700'
  }

  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${planColors[plan] || 'bg-gray-100 text-gray-700'}`}>
      {plan}
    </span>
  )
}

const ActionMenu = ({ subscription, onView, onEdit, onCancel }: any) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              onView(subscription)
              setIsOpen(false)
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          <button
            onClick={() => {
              onEdit(subscription)
              setIsOpen(false)
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Subscription</span>
          </button>
          {subscription.status === 'active' && (
            <button
              onClick={() => {
                onCancel(subscription)
                setIsOpen(false)
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Subscription</span>
            </button>
          )}
          {subscription.status === 'past_due' && (
            <button
              onClick={() => {
                /* Handle retry payment */ setIsOpen(false)
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Payment</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [sortBy, setSortBy] = useState('nextBilling')
  const [sortOrder, setSortOrder] = useState('asc')

  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptionsData
    .filter((sub) => {
      const matchesSearch =
        sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
      const matchesPlan = planFilter === 'all' || sub.plan === planFilter
      return matchesSearch && matchesStatus && matchesPlan
    })
    .sort((a: any, b: any) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'amount') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      } else if (sortBy === 'nextBilling' || sortBy === 'startDate') {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleView = (subscription: string) => {
    console.log('View subscription:', subscription)
    // Implement view logic
  }

  const handleEdit = (subscription: string) => {
    console.log('Edit subscription:', subscription)
    // Implement edit logic
  }

  const handleCancel = (subscription: string) => {
    console.log('Cancel subscription:', subscription)
    // Implement cancel logic
  }

  const exportData = () => {
    console.log('Exporting subscriptions data...')
    // Implement export logic
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
              <p className="text-gray-600 mt-1">Manage all customer subscriptions</p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-bold text-gray-900">
                    {subscriptionsData.filter((s) => s.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Past Due</p>
                  <p className="text-xl font-bold text-gray-900">
                    {subscriptionsData.filter((s) => s.status === 'past_due').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trial</p>
                  <p className="text-xl font-bold text-gray-900">
                    {subscriptionsData.filter((s) => s.status === 'trialing').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total MRR</p>
                  <p className="text-xl font-bold text-gray-900">
                    $
                    {subscriptionsData
                      .filter((s) => s.status === 'active')
                      .reduce((sum, s) => {
                        return sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount)
                      }, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 flex-1 min-w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-none outline-none text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="past_due">Past Due</option>
              <option value="trialing">Trial</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </motion.div>

        {/* Subscriptions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('nextBilling')}
                  >
                    Next Billing
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription, index) => (
                  <motion.tr
                    key={subscription.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{subscription.customerName}</div>
                          <div className="text-sm text-gray-500">{subscription.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PlanBadge plan={subscription.plan} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={subscription.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${subscription.amount}</div>
                      <div className="text-sm text-gray-500">{subscription.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{subscription.billingCycle}</div>
                      <div className="text-sm text-gray-500">{subscription.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ActionMenu
                        subscription={subscription}
                        onView={handleView}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Subscriptions
