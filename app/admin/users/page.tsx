'use client'

import React, { useState } from 'react'
import { Users } from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'
import ManageTokensDrawer from '@/app/drawers/admin/ManageTokensDrawer'
import CustomerDetailsDrawer from '@/app/drawers/admin/CustomerDetailsDrawer'
import { userFilter } from '@/app/lib/utils'
import exportUsersData from '@/app/lib/utils/exports/exportUserData'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'
import UsersStats from '@/app/components/admin/users/UsersStats'

import FilterAndSearch from '@/app/components/admin/users/FilterAndSearch'
import UserTable from '@/app/components/admin/users/UserTable'

const AdminUsersPage = () => {
  const { users, summary } = useAppSelector((state: RootState) => state.admin)
  const { user: loggedInUser } = useAppSelector((state: RootState) => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [userTypeFilter, setUserTypeFilter] = useState('all')
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
          <FilterAndSearch
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            setSearchTerm={setSearchTerm}
            setUserTypeFilter={setUserTypeFilter}
            userTypeFilter={userTypeFilter}
          />
        </div>
        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <UserTable filteredUsers={filteredUsers} loggedInUser={loggedInUser} />
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
