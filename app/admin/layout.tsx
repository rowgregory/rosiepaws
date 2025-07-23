'use client'

import React, { FC } from 'react'
import { ChildrenProps } from '../types/common'
import AdminNavigation from '../components/admin/AdminNavigation'
import { useFetchDashboardDataQuery } from '../redux/services/adminApi'

const AdminLayout: FC<ChildrenProps> = ({ children }) => {
  useFetchDashboardDataQuery(undefined)
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
