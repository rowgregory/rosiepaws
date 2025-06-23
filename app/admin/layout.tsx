'use client'

import React, { FC, useState } from 'react'
import { ChildrenProps } from '../types/common.types'
import AwesomeIcon from '../components/common/AwesomeIcon'
import {
  blogIcon,
  catIcon,
  chevronDownIcon,
  dashboardIcon,
  gearIcon,
  magnifyingGlassIcon,
  pawIcon,
  penIcon,
  plusIcon,
  signOutAltIcon,
  starIcon,
  usersIcon
} from '../lib/icons'
import {
  authLoginLink,
  blogLink,
  dashboardLink,
  journalLink,
  petsLink,
  subscriptionsLink,
  usersLink
} from '@/public/data/admin.data'
import useCustomPathname from '../hooks/useCustomPathname'
import Link from 'next/link'
import { useAppDispatch } from '../redux/store'
import { useLogoutMutation } from '../redux/services/authApi'
import { useRouter } from 'next/navigation'
import { setAuthState } from '../redux/features/authSlice'
import Spinner from '../components/common/Spinner'

const adminLinkData = (path: string) => [
  {
    icon: dashboardIcon,
    textKey: 'Dashboard',
    linkKey: dashboardLink,
    isActive: path === dashboardLink
  },
  {
    icon: starIcon,
    textKey: 'Subscriptions',
    linkKey: subscriptionsLink,
    isActive: path === subscriptionsLink
  },
  {
    icon: catIcon,
    textKey: 'Pets',
    linkKey: petsLink,
    isActive: path === petsLink
  },
  {
    icon: blogIcon,
    textKey: 'Blog',
    linkKey: blogLink,
    isActive: path === blogLink
  },
  {
    icon: penIcon,
    textKey: 'Journal',
    linkKey: journalLink,
    isActive: path === journalLink
  },
  {
    icon: usersIcon,
    textKey: 'Users',
    linkKey: usersLink,
    isActive: path === usersLink
  },
  {
    icon: signOutAltIcon,
    textKey: 'Logout',
    linkKey: authLoginLink,
    isActive: path === authLoginLink
  }
]

const AdminSidebar = ({ toggleSidebar, setToggleSidebar }: any) => {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const { push } = useRouter()

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault()
    await logout({})
      .unwrap()
      .then(() => {
        dispatch(setAuthState({ isAuthenticated: false, id: '', role: '' }))
        push('/auth/login')
      })
      .catch(() => {})
  }

  return (
    <div
      className={`${
        toggleSidebar ? 'w-16' : 'w-60'
      } hidden lg:block fixed top-0 left-0 min-h-screen border-r-1 border-r-zinc-200/60 z-20`}
    >
      <div className={`px-3.5 h-[60px] flex items-center cursor-pointer ${toggleSidebar ? 'justify-center' : ''}`}>
        <div
          className={`rounded-lg w-full p-2.5 hover:bg-zinc-100 flex items-center ${
            toggleSidebar ? 'w-fit justify-center' : 'justify-between'
          }`}
        >
          <div className="flex gap-x-2 items-center">
            <AwesomeIcon icon={pawIcon} className="w-3.5 h-3.5 text-[#484954]" />
            <h1
              className={`${toggleSidebar ? 'hidden' : 'block'} text-12 text-[#323439] font-semibold whitespace-nowrap`}
            >
              Rosie Paws
            </h1>
          </div>
          <AwesomeIcon
            icon={chevronDownIcon}
            className={`${toggleSidebar ? 'hidden' : 'block'} w-2.5 h-2.5 text-[#484954]`}
          />
        </div>
      </div>
      <button onClick={() => setToggleSidebar(!toggleSidebar)} className="absolute top-1/2 -translate-y-1/2 -right-4">
        |
      </button>
      <div
        className={`p-3.5 flex items-center flex-col w-full gap-y-1 aspect-square ${
          toggleSidebar ? 'justify-center' : ''
        }`}
      >
        {adminLinkData(path).map((link, i) => (
          <Link
            key={i}
            onClick={(e: any) => (link.textKey === 'Logout' ? handleLogout(e) : {})}
            href={link.linkKey}
            className={`rounded-lg w-full px-2.5 py-2 hover:bg-zinc-100 flex items-center ${
              toggleSidebar ? 'w-[34px] h-[34px] justify-center' : 'justify-between'
            } ${toggleSidebar && link.isActive && 'bg-[#f4f5fb]'}`}
          >
            <div className="flex gap-x-2 items-center">
              {isLoading && link.textKey === 'Logout' ? (
                <Spinner fill="fill-indigo-500" track="text-white" wAndH="w-3 h-3" />
              ) : (
                <AwesomeIcon
                  icon={link.icon}
                  className={`${link.isActive ? 'text-indigo-500' : 'text-[#484954]'} w-3.5 h-3.5`}
                />
              )}
              <h1
                className={`${toggleSidebar ? 'hidden' : 'block'} ${
                  link.isActive ? 'text-indigo-500' : 'text-[#484954]'
                } text-12 font-semibold whitespace-nowrap`}
              >
                {link.textKey}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const TopToolBar = () => {
  const path = useCustomPathname()
  return (
    <div className="sticky top-0 w-full h-[60px] bg-white z-30 px-10">
      <div className="max-w-screen-xl w-full mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-x-2 bg-[#f6f5f7] rounded-md max-w-lg w-full h-9 py-2.5 pl-3 pr-7">
          <AwesomeIcon icon={magnifyingGlassIcon} className="w-3 h-3" />
          <input
            className="w-full focus:outline-none bg-transparent placeholder:text-sm placeholder:text-[#484954]"
            placeholder="Search"
          />
        </div>
        <div className="flex">
          <div className="w-9 h-9 cursor-pointer rounded-full hover:bg-zinc-100 flex items-center justify-center">
            <Link href="/admin/settings">
              <AwesomeIcon
                icon={gearIcon}
                className={`w-4 h-4 ${path === '/admin/settings' ? 'text-indigo-500' : 'text-[#484954]'}`}
              />
            </Link>
          </div>
          <div className="w-9 h-9 cursor-pointer rounded-full hover:bg-zinc-100 flex items-center justify-center">
            <button className="bg-indigo-500 p-0.5 rounded-full flex items-center justify-center">
              <AwesomeIcon icon={plusIcon} className={`w-4 h-4 text-white`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const AdminLayout: FC<ChildrenProps> = ({ children }) => {
  const [toggleSidebar, setToggleSidebar] = useState(false)

  return (
    <div className="flex">
      <AdminSidebar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
      <div className={`flex flex-col w-full ${toggleSidebar ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-60'}`}>
        <TopToolBar />
        <div className="px-10 pt-2">
          <div className="max-w-screen-xl w-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
