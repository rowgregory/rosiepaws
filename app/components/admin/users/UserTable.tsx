import { useState } from 'react'
import TableHeader from '@/app/components/admin/common/TableHeader'
import { USERS_COLUMNS } from '@/app/lib/constants/admin/users'
import { MoreVertical, Mail, Calendar, Eye, CheckCircle, Zap } from 'lucide-react'
import { getUserTypeColor, getUserTypeIcon, getUserTypeName } from '@/app/lib/utils/admin/users/displayUtils'
import { setOpenCustomerDetailsDrawer, setOpenManageTokensDrawer } from '@/app/redux/features/adminSlice'
import { formatDateShort } from '@/app/lib/utils'
import { useAppDispatch } from '@/app/redux/store'
import { IUser } from '@/app/types'
import { useUpdateUserTierMutation } from '@/app/redux/services/adminApi'
import { showToast } from '@/app/redux/features/toastSlice'

const UserTable = ({ filteredUsers, loggedInUser }: any) => {
  const [showActions, setShowActions] = useState(null) as any
  const [showTierMenu, setShowTierMenu] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const [updateUserTier, { isLoading }] = useUpdateUserTierMutation()

  const handleTierChange = async (userId: string, newTier: 'Free' | 'Comfort' | 'Legacy') => {
    try {
      await updateUserTier({ userId, tier: newTier }).unwrap()
      setShowTierMenu(null)
      dispatch(showToast({ message: `User tier updated to ${newTier}`, type: 'success' }))
    } catch (error: any) {
      dispatch(showToast({ message: `Error updating tier: ${error?.data?.message}`, type: 'error' }))
    }
  }

  const canChangeTier = (user: IUser) => {
    return loggedInUser?.isSuperUser && !user.isAdmin && !user.isSuperUser
  }

  return (
    <table className="w-full">
      <TableHeader columns={USERS_COLUMNS} />
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredUsers.map((user: IUser) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                    {user.emailVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="relative">
                <button
                  onClick={() => {
                    if (canChangeTier(user)) {
                      setShowTierMenu(showTierMenu === user.id ? null : user.id)
                    }
                  }}
                  disabled={!canChangeTier(user) || isLoading}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(user)} ${
                    canChangeTier(user) ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  {getUserTypeIcon(user)}
                  {getUserTypeName(user)}
                  {canChangeTier(user) && (
                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {showTierMenu === user.id && canChangeTier(user) && (
                  <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                    <button
                      onClick={() => handleTierChange(user.id, 'Free')}
                      disabled={isLoading || user.role === 'Free'}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                        user.role === 'Free' ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      Free
                      {user.role === 'Free' && <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />}
                    </button>
                    <button
                      onClick={() => handleTierChange(user.id, 'Comfort')}
                      disabled={isLoading || user.role === 'Comfort'}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                        user.role === 'Comfort' ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Comfort
                      {user.role === 'Comfort' && <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />}
                    </button>
                    <button
                      onClick={() => handleTierChange(user.id, 'Legacy')}
                      disabled={isLoading || user.role === 'Legacy'}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                        user.role === 'Legacy' ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      Legacy
                      {user.role === 'Legacy' && <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />}
                    </button>
                  </div>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  {user.role === 'Legacy' ? '♾️' : user.tokens.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Used: {user.tokensUsed.toLocaleString()}</div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                <div>
                  {user?.pets?.length} pet{user?.pets?.length > 1 || (user?.pets?.length === 0 && 's')}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.tickets?.length} ticket
                  {(user?.tickets?.length > 1 || user?.tickets?.length === 0) && 's'}
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  {formatDateShort(user.createdAt)}
                </div>
                <div className="text-xs text-gray-500">Reset: {formatDateShort(user.lastTokenReset)}</div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="relative">
                <button
                  onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showActions === user.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => dispatch(setOpenCustomerDetailsDrawer(user))}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </button>
                      {loggedInUser?.isSuperUser && (
                        <button
                          onClick={() => dispatch(setOpenManageTokensDrawer(user))}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Zap className="w-3 h-3" />
                          Manage Tokens
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserTable
