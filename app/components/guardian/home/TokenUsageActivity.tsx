import { FC } from 'react'

import { IUser } from '@/app/types'
import { formatDate } from '@/app/lib/utils'

const TokenUsageActivity: FC<{ user: IUser | null; tokenTransactions: any[] }> = ({ user, tokenTransactions }) => {
  return (
    <div className="bg-white lg:rounded-lg lg:shadow-sm border border-t-gray-200 border-b-gray-200 lg:border-gray-200 p-4 lg:p-6 h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Token Activity</h2>
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Current Balance: {user?.isLegacyUser ? '♾️' : `${user?.tokens?.toLocaleString()} tokens`}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto lg:pr-2 max-h-[400px]">
        <div className="space-y-3">
          {tokenTransactions
            ?.map((transaction) => {
              return (
                <div
                  key={transaction.id}
                  className="flex items-center py-3 lg:px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm truncate">{transaction.description}</p>
                      <div className="font-semibold text-gray-900 text-sm ml-4">{transaction.amount} tokens</div>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt, { includeTime: true })}
                      </span>
                      <span className="text-xs text-gray-500">{transaction.type.toLowerCase().replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              )
            })
            .reverse()}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-end text-sm">
          <div className="text-gray-500">Total: {user?.tokensUsed?.toLocaleString()} tokens used</div>
        </div>
      </div>
    </div>
  )
}

export default TokenUsageActivity
