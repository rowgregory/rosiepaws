'use client'

import React, { FC } from 'react'
import AdminNavigation from '../components/admin/AdminNavigation'
import { useFetchAdminDashboardDataQuery } from '../redux/services/adminApi'
import { IChildren } from '../types'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { Menu } from 'lucide-react'
import { setOpenAdminMobileNavigation } from '../redux/features/adminSlice'
import AdminMobileNavigation from '../drawers/admin/AdminMobileNavigation'

const AdminLayout: FC<IChildren> = ({ children }) => {
  useFetchAdminDashboardDataQuery(undefined)
  const { navigation } = useAppSelector((state: RootState) => state.app)
  const dispatch = useAppDispatch()

  return (
    <>
      <AdminMobileNavigation />
      <div className="flex">
        <AdminNavigation />
        <div
          className={`flex flex-col mx-auto duration-300 w-full ${navigation ? 'lg:w-[calc(100vw-64px)] lg:ml-16' : 'lg:w-[calc(100vw-256px)] lg:ml-64'}`}
        >
          <div
            onClick={() => dispatch(setOpenAdminMobileNavigation())}
            className="block lg:hidden bg-gray-50 pl-6 pt-6 cursor-pointer"
          >
            <Menu className="w-7 h-7" />
          </div>
          {children}
        </div>
      </div>
    </>
  )
}

export default AdminLayout
