import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Mail,
  Clock,
  Shield,
  Crown,
  Star,
  Heart,
  Ticket,
  Activity,
  CheckCircle,
  Plus,
  Minus,
  History,
  Eye,
  Settings,
  Cat
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setCloseCustomerDetailsDrawer, setOpenManageTokensDrawer } from '@/app/redux/features/adminSlice'

const CustomerDetailsDrawer = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const dispatch = useAppDispatch()
  const { customerDetailsDrawer, user } = useAppSelector((state: RootState) => state.admin)
  const { user: loggedInUser } = useAppSelector((state: RootState) => state.user)
  const onClose = () => dispatch(setCloseCustomerDetailsDrawer())

  const getUserTypeInfo = (user: any) => {
    if (user.isSuperUser) return { type: 'Super User', icon: Crown, color: 'red' }
    if (user.isAdmin) return { type: 'Admin', icon: Shield, color: 'purple' }
    if (user.isComfortUser) return { type: 'Comfort', icon: Star, color: 'green' }
    if (user.isLegacyUser) return { type: 'Legacy', icon: Clock, color: 'yellow' }
    return { type: 'Free', icon: User, color: 'gray' }
  }

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Never'
  }

  const formatDateTime = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleString() : 'Never'
  }

  const getTokenUsagePercentage = () => {
    const total = user.tokens + user.tokensUsed
    return total > 0 ? (user.tokensUsed / total) * 1000 : 0
  }

  const userTypeInfo = getUserTypeInfo(user)
  const IconComponent = userTypeInfo.icon

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'pets', label: 'Pets', icon: Heart },
    { id: 'tickets', label: 'Support', icon: Ticket }
  ]

  const getUserTypeColor = (color: string) => {
    const colors: any = {
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[color] || colors.gray
  }

  return (
    <AnimatePresence>
      {customerDetailsDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
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
              <div className="bg-white px-6 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Customer Profile</h2>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* User Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                      {user.emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(userTypeInfo.color)}`}
                      >
                        <IconComponent className="w-3 h-3" />
                        {userTypeInfo.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.tokens.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user?.pets?.length || 0}</div>
                    <div className="text-xs text-gray-500">Pets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user?.tickets?.length || 0}</div>
                    <div className="text-xs text-gray-500">Tickets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{Math.round(getTokenUsagePercentage())}%</div>
                    <div className="text-xs text-gray-500">Usage</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <TabIcon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6 space-y-6"
                    >
                      {/* Account Information */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">User ID</label>
                            <p className="text-sm text-gray-900 font-mono">{user.id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Role</label>
                            <p className="text-sm text-gray-900">{user.role}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Member Since</label>
                            <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Last Updated</label>
                            <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email Verified</label>
                            <p className="text-sm text-gray-900">Yes</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Stripe Customer</label>
                            <p className="text-sm text-gray-900">{user.stripeCustomerId ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Token Information */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Token Management</h3>

                          {loggedInUser?.isSuperUser && (
                            <button
                              onClick={() => {
                                dispatch(setCloseCustomerDetailsDrawer())
                                dispatch(setOpenManageTokensDrawer(user))
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                              <Settings className="w-4 h-4" />
                              Manage
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{user.tokens.toLocaleString()}</div>
                            <div className="text-sm text-green-700">Available</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{user.tokensUsed.toLocaleString()}</div>
                            <div className="text-sm text-orange-700">Used</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {(user.tokens + user.tokensUsed).toLocaleString()}
                            </div>
                            <div className="text-sm text-blue-700">Total</div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Usage Progress</span>
                            <span>{Math.round(getTokenUsagePercentage())}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getTokenUsagePercentage()}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">Last token reset: {formatDate(user.lastTokenReset)}</div>
                      </div>

                      {/* Activity Summary */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Heart className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Pets Registered</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{user?.pets?.length || 0}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Ticket className="w-5 h-5 text-purple-600" />
                              <span className="font-medium">Support Tickets</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{user?.tickets?.length || 0}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <History className="w-5 h-5 text-green-600" />
                              <span className="font-medium">Token Transactions</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                              {user?.tokenTransactions?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === 'activity' && (
                    <motion.div
                      key="activity"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Token Transactions</h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {user.tokenTransactions?.length > 0 ? (
                          user.tokenTransactions.map((transaction: any) => (
                            <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {transaction.amount < 0 ? (
                                    <Minus className="w-4 h-4 text-red-600" />
                                  ) : (
                                    <Plus className="w-4 h-4 text-green-600" />
                                  )}
                                  <div>
                                    <span
                                      className={`text-sm font-medium ${
                                        transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                                      }`}
                                    >
                                      {Math.abs(transaction.amount)} tokens
                                    </span>
                                    <p className="text-xs text-gray-600">{transaction.description}</p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">{formatDateTime(transaction.createdAt)}</span>
                              </div>
                              {transaction.metadata?.reason && (
                                <p className="text-xs text-gray-500 mt-2 italic">
                                  Reason: {transaction.metadata.reason}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No token transactions yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Pets Tab */}
                  {activeTab === 'pets' && (
                    <motion.div
                      key="pets"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Pets</h3>
                      <div className="space-y-4">
                        {user.pets?.length > 0 ? (
                          user.pets.map((pet: any) => (
                            <div key={pet.id} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Cat className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{pet.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {pet.breed} • {pet.age} years old
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No pets registered yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Tickets Tab */}
                  {activeTab === 'tickets' && (
                    <motion.div
                      key="tickets"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h3>
                      <div className="space-y-4">
                        {user.tickets?.length > 0 ? (
                          user.tickets.map((ticket: any) => (
                            <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                                  <p className="text-sm text-gray-600">
                                    {ticket.category} • {ticket.priority}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No support tickets yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CustomerDetailsDrawer
