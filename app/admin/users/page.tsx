'use client'

import React, { useState } from 'react'
import { Users, MoreVertical, Mail, Calendar, Eye, CheckCircle, Zap } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { getUserTypeColor, getUserTypeIcon, getUserTypeName } from '@/app/lib/utils/admin/users/displayUtils'
import ManageTokensDrawer from '@/app/drawers/admin/ManageTokensDrawer'
import { setOpenCustomerDetailsDrawer, setOpenManageTokensDrawer } from '@/app/redux/features/adminSlice'
import CustomerDetailsDrawer from '@/app/drawers/admin/CustomerDetailsDrawer'
import { formatDateShort } from '@/app/lib/utils/common/dateUtils'
import { userFilter } from '@/app/lib/utils'
import exportUsersData from '@/app/lib/utils/exports/exportUserData'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'
import UsersStats from '@/app/components/admin/users/UsersStats'
import TableHeader from '@/app/components/admin/common/TableHeader'
import { USERS_COLUMNS } from '@/app/lib/constants/admin/users'
import FilterSearch from '@/app/components/admin/form-elements/FilterSearch'

const AdminUsersPage = () => {
  const dispatch = useAppDispatch()
  const { users, summary } = useAppSelector((state: RootState) => state.admin)
  const { user: loggedInUser } = useAppSelector((state: RootState) => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [userTypeFilter, setUserTypeFilter] = useState('all')
  const [showActions, setShowActions] = useState(null) as any
  const filteredUsers = userFilter(users, searchTerm, roleFilter, userTypeFilter)

  return (
    <>
      <ManageTokensDrawer />
      <CustomerDetailsDrawer />
      <div className="bg-gray-50 min-h-screen p-6">
        <AdminPageHeader
          title="User Management"
          subtitle="Manage platform users, roles, and permissions"
          onExport={exportUsersData}
        />
        <div className="mb-8">
          <UsersStats summary={summary} />
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <FilterSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search users by name or email..."
              />

              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="free">Free</option>
                  <option value="comfort">Comfort</option>
                  <option value="companion">Companion</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="super">Super Users</option>
                  <option value="admin">Admins</option>
                  <option value="companion">Companion</option>
                  <option value="comfort">Comfort</option>
                  <option value="legacy">Legacy</option>
                  <option value="free">Free</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader columns={USERS_COLUMNS} />
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
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
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(user)}`}
                      >
                        {getUserTypeIcon(user)}
                        {getUserTypeName(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-500" />
                          {user.tokens.toLocaleString()}
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
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminUsersPage
