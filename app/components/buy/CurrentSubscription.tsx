import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { formatDate } from '@/app/lib/utils'
import SubscriptionPlan from './SubscriptionPlan'
import { IUser } from '@/app/types'

const CurrentSubscription: FC<{ user: IUser | null }> = ({ user }) => {
  if (user?.isFreeUser) return

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-20"
    >
      {user?.stripeSubscription?.cancelAtPeriodEnd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-amber-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 mb-1">Subscription Cancellation Scheduled</h4>
                <p className="text-amber-800 text-sm mb-2">
                  Your {user?.isComfortUser ? 'Comfort' : 'Legacy'} plan will be canceled on{' '}
                  <span className="font-medium">
                    {formatDate(user?.stripeSubscription.currentPeriodEnd, { includeTime: true })}
                  </span>
                  . You&apos;ll continue to have full access until then.
                </p>
                <p className="text-amber-700 text-xs">
                  After this date, you&apos;ll be moved to the Free plan with 250 tokens per month.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <SubscriptionPlan user={user} />
    </motion.div>
  )
}

export default CurrentSubscription
