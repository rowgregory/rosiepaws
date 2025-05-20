import useCustomPathname from '@/app/hooks/useCustomPathname'
import React, { MouseEvent } from 'react'
import AwesomeIcon from '../common/AwesomeIcon'
import {
  catIcon,
  chevronDownIcon,
  circleUserIcon,
  dashboardIcon,
  pawIcon,
  plusIcon,
  signOutAltIcon,
  userCheckIcon
} from '@/app/lib/icons'
import Link from 'next/link'
import {
  authLoginLink,
  guardianDashboardLink,
  guardianPetsLink,
  guardianProfileLink,
  guardianSubscriptionLink
} from '@/public/admin.data'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setClosePetDrawer, setOpenPetDrawer } from '@/app/redux/features/petSlice'
import { useLogoutMutation } from '@/app/redux/services/authApi'
import { setAuthState } from '@/app/redux/features/authSlice'
import { useRouter } from 'next/navigation'
import Spinner from '../common/Spinner'

const guardianLinkData = (path: string) => [
  {
    icon: dashboardIcon,
    textKey: 'Dashboard',
    linkKey: guardianDashboardLink,
    isActive: path === guardianDashboardLink
  },
  {
    icon: catIcon,
    textKey: 'Pets',
    linkKey: guardianPetsLink,
    isActive: path === guardianPetsLink
  },
  {
    icon: userCheckIcon,
    textKey: 'Subscription',
    linkKey: guardianSubscriptionLink,
    isActive: path === guardianSubscriptionLink
  },
  {
    icon: circleUserIcon,
    textKey: 'Profile',
    linkKey: guardianProfileLink,
    isActive: path === guardianProfileLink
  },
  {
    icon: signOutAltIcon,
    textKey: 'Logout',
    linkKey: authLoginLink,
    isActive: path === authLoginLink
  }
]

const GuardianNavigation = ({ toggleSidebar, setToggleSidebar }: any) => {
  const path = useCustomPathname()
  const { petDrawer, zeroPets, pet, loading } = useAppSelector((state: RootState) => state.pet)
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
          onClick={() => (petDrawer ? dispatch(setClosePetDrawer()) : zeroPets ? dispatch(setOpenPetDrawer()) : {})}
          className={`rounded-lg w-full p-2.5 hover:bg-zinc-100 flex items-center ${
            toggleSidebar ? 'w-fit justify-center' : 'justify-between'
          }`}
        >
          <div className="flex gap-x-2 items-center">
            <AwesomeIcon icon={zeroPets ? plusIcon : pawIcon} className="w-3.5 h-3.5 text-[#484954]" />
            {loading ? (
              <Spinner fill="fill-indigo-500" track="text-white" wAndH="w-3 h-3" />
            ) : (
              <h1
                className={`${
                  toggleSidebar ? 'hidden' : 'block'
                } text-12 text-[#323439] font-semibold whitespace-nowrap`}
              >
                {zeroPets ? 'Add Pet' : pet?.name}
              </h1>
            )}
          </div>
          <AwesomeIcon
            icon={chevronDownIcon}
            className={`${toggleSidebar || zeroPets ? 'hidden' : 'block'} w-2.5 h-2.5 text-[#484954]`}
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
        {guardianLinkData(path).map((link, i) => (
          <Link
            onClick={(e) => (link.textKey === 'Logout' ? handleLogout(e) : {})}
            key={i}
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
export default GuardianNavigation
