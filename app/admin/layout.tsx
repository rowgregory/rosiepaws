'use client'

import React, { FC, useState } from 'react'
import { ChildrenProps } from '../types/common.types'
// import { blogIcon, catIcon, dashboardIcon, signOutAltIcon, starIcon } from '../lib/icons'
// import {
//   authLoginLink,
//   blogLink,
//   dashboardLink,
//   petsLink,
//   settingsLink,
//   subscriptionsLink
// } from '@/public/data/admin.data'
// import useCustomPathname from '../hooks/useCustomPathname'
// import Link from 'next/link'
// import { useAppDispatch } from '../redux/store'
// import { useLogoutMutation } from '../redux/services/authApi'
// import { useRouter } from 'next/navigation'
// import { setAuthState } from '../redux/features/authSlice'
// import Spinner from '../components/common/Spinner'
import AdminToolbar from '../components/admin/AdminToolbar'
import AdminNavigation from '../components/admin/AdminNavigation'

// const adminLinkData = (path: string) => [
//   {
//     icon: dashboardIcon,
//     textKey: 'Dashboard',
//     linkKey: dashboardLink,
//     isActive: path === dashboardLink
//   },
//   {
//     icon: starIcon,
//     textKey: 'Subscriptions',
//     linkKey: subscriptionsLink,
//     isActive: path === subscriptionsLink
//   },
//   {
//     icon: catIcon,
//     textKey: 'Pets',
//     linkKey: petsLink,
//     isActive: path === petsLink
//   },
//   {
//     icon: blogIcon,
//     textKey: 'Blog',
//     linkKey: blogLink,
//     isActive: path === blogLink
//   },
//   {
//     icon: blogIcon,
//     textKey: 'Settings',
//     linkKey: settingsLink,
//     isActive: path === settingsLink
//   },
//   {
//     icon: signOutAltIcon,
//     textKey: 'Logout',
//     linkKey: authLoginLink,
//     isActive: path === authLoginLink
//   }
// ]

// const AdminSidebar = ({ toggleSidebar, setToggleSidebar }: any) => {
//   const path = useCustomPathname()
//   const dispatch = useAppDispatch()
//   const [logout, { isLoading }] = useLogoutMutation()
//   const { push } = useRouter()

//   const handleLogout = async (e: MouseEvent) => {
//     e.preventDefault()
//     await logout({})
//       .unwrap()
//       .then(() => {
//         dispatch(setAuthState({ isAuthenticated: false, id: '', role: '' }))
//         push('/auth/login')
//       })
//       .catch(() => {})
//   }

//   return (
//     <div
//       className={`${
//         toggleSidebar ? 'w-16' : 'w-60'
//       } hidden lg:block fixed top-0 left-0 min-h-screen border-r-1 border-r-zinc-200/60 z-20`}
//     >
//       <div className={`px-3.5 h-[60px] flex items-center cursor-pointer ${toggleSidebar ? 'justify-center' : ''}`}>
//         <div
//           className={`rounded-lg w-full p-2.5 hover:bg-zinc-100 flex items-center ${
//             toggleSidebar ? 'w-fit justify-center' : 'justify-between'
//           }`}
//         >
//           <div className="flex gap-x-2 items-center">
//             <AwesomeIcon icon={pawIcon} className="w-3.5 h-3.5 text-[#484954]" />
//             <h1
//               className={`${toggleSidebar ? 'hidden' : 'block'} text-12 text-[#323439] font-semibold whitespace-nowrap`}
//             >
//               Rosie Paws
//             </h1>
//           </div>
//           <AwesomeIcon
//             icon={chevronDownIcon}
//             className={`${toggleSidebar ? 'hidden' : 'block'} w-2.5 h-2.5 text-[#484954]`}
//           />
//         </div>
//       </div>
//       <button onClick={() => setToggleSidebar(!toggleSidebar)} className="absolute top-1/2 -translate-y-1/2 -right-4">
//         |
//       </button>
//       <div
//         className={`p-3.5 flex items-center flex-col w-full gap-y-1 aspect-square ${
//           toggleSidebar ? 'justify-center' : ''
//         }`}
//       >
//         {adminLinkData(path).map((link, i) => (
//           <Link
//             key={i}
//             onClick={(e: any) => (link.textKey === 'Logout' ? handleLogout(e) : {})}
//             href={link.linkKey}
//             className={`rounded-lg w-full px-2.5 py-2 hover:bg-zinc-100 flex items-center ${
//               toggleSidebar ? 'w-[34px] h-[34px] justify-center' : 'justify-between'
//             } ${toggleSidebar && link.isActive && 'bg-[#f4f5fb]'}`}
//           >
//             <div className="flex gap-x-2 items-center">
//               {isLoading && link.textKey === 'Logout' ? (
//                 <Spinner fill="fill-indigo-500" track="text-white" wAndH="w-3 h-3" />
//               ) : (
//                 <AwesomeIcon
//                   icon={link.icon}
//                   className={`${link.isActive ? 'text-indigo-500' : 'text-[#484954]'} w-3.5 h-3.5`}
//                 />
//               )}
//               <h1
//                 className={`${toggleSidebar ? 'hidden' : 'block'} ${
//                   link.isActive ? 'text-indigo-500' : 'text-[#484954]'
//                 } text-12 font-semibold whitespace-nowrap`}
//               >
//                 {link.textKey}
//               </h1>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }

const AdminLayout: FC<ChildrenProps> = ({ children }) => {
  const [toggleSidebar] = useState(false)

  return (
    <div className="flex">
      <AdminNavigation />
      <div className={`flex flex-col w-full ${toggleSidebar ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-60'}`}>
        <AdminToolbar />
        <div className="px-10 pt-2">
          <div className="max-w-screen-xl w-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
