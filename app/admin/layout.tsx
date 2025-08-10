'use client'

import React, { FC } from 'react'
import AdminNavigation from '../components/admin/AdminNavigation'
import { useFetchAdminDashboardDataQuery } from '../redux/services/adminApi'
import { IChildren } from '../types'

const AdminLayout: FC<IChildren> = ({ children }) => {
  useFetchAdminDashboardDataQuery(undefined)
  return (
    <>
      <div className="flex">
        <AdminNavigation />
        <div className={`flex flex-col w-full mx-auto ml-0 md:ml-64`}>{children}</div>
      </div>
    </>
  )
}

export default AdminLayout
