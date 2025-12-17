import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Plus, Minus, History, User, Mail, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setCloseManageTokensDrawer } from '@/app/redux/features/adminSlice'
import { useUpdateUserTokensMutation } from '@/app/redux/services/adminApi'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import SlideMessage from '@/app/components/auth/SlideMessage'

const ManageTokensDrawer = () => {
  const [tokenAmount, setTokenAmount] = useState('')
  const [transactionType, setTransactionType] = useState<'add' | 'remove'>('add')
  const [reason, setReason] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { manageTokensDrawer, user } = useAppSelector((state: RootState) => state.admin)
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseManageTokensDrawer())
  const [updateUserTokens, { isLoading, error }] = useUpdateUserTokensMutation() as any

  useEffect(() => {
    if (manageTokensDrawer && user) {
      setTokenAmount('')
      setReason('')
      setTransactionType('add')
      setShowSuccess(false)
    }
  }, [manageTokensDrawer, user])

  const handleSubmit = async () => {
    if (!tokenAmount || !reason.trim()) {
      return
    }

    const amount = parseInt(tokenAmount)
    if (isNaN(amount) || amount <= 0) {
      return
    }

    // Check if removing more tokens than user has
    if (transactionType === 'remove' && amount > user.tokens) {
      alert(`Cannot remove ${amount} tokens. User only has ${user.tokens} tokens.`)
      return
    }

    await updateUserTokens({
      userId: user.id,
      amount: transactionType === 'add' ? amount : -amount,
      reason: reason.trim()
    })
      .unwrap()
      .then(() => {
        setShowSuccess(true)
        setTokenAmount('')
        setReason('')

        // Auto-hide success message
        setTimeout(() => setShowSuccess(false), 3000)
      })
      .catch(() => {
        dispatch(setOpenSlideMessage())
      })
  }

  const quickAmounts = [100, 250, 500, 1000]

  return (
    <>
      <SlideMessage message={error?.data?.message} type="Error" />
      <AnimatePresence>
        {manageTokensDrawer && user && (
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
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-yellow-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Manage Tokens</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Success Message */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-800 font-medium">Tokens updated successfully!</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* User Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name || 'No Name'}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Current Tokens</span>
                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                          <Zap className="w-3 h-3 text-yellow-500" />
                          {user?.tokens?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tokens Used</span>
                        <div className="font-semibold text-gray-900">{user?.tokensUsed?.toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Token Management Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Transaction Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Action</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setTransactionType('add')}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                            transactionType === 'add'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          Add Tokens
                        </button>
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Quick Amounts</label>
                      <div className="grid grid-cols-2 gap-2">
                        {quickAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setTokenAmount(amount.toString())}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                              tokenAmount === amount.toString()
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Token Amount</label>
                      <div className="relative">
                        <Zap className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          placeholder="Enter amount"
                          min="1"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      {transactionType === 'remove' && tokenAmount && parseInt(tokenAmount) > user.tokens && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 flex items-center gap-1 text-sm text-red-600"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Cannot remove more tokens than user has ({user.tokens})
                        </motion.div>
                      )}
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for token adjustment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={
                        !tokenAmount ||
                        !reason.trim() ||
                        isLoading ||
                        (transactionType === 'remove' && parseInt(tokenAmount) > user.tokens)
                      }
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                        transactionType === 'add'
                          ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300'
                          : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300'
                      } disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </div>
                      ) : (
                        `${transactionType === 'add' ? 'Add' : 'Remove'} ${tokenAmount || '0'} Tokens`
                      )}
                    </button>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-4 h-4 text-gray-400" />
                      <h3 className="font-medium text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="space-y-3 h-64 overflow-y-auto">
                      {/* Mock recent transactions */}
                      {user?.tokenTransactions?.map((transaction: any) => (
                        <div key={transaction.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {transaction.amount < 0 ? (
                                <Minus className="w-3 h-3 text-red-600" />
                              ) : (
                                <Plus className="w-3 h-3 text-green-600" />
                              )}
                              <span
                                className={`text-sm font-medium ${
                                  transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                                }`}
                              >
                                {Math.abs(transaction.amount)} tokens
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{transaction.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ManageTokensDrawer
