'use client'

import React, { FC } from 'react'
import { ChildrenProps } from '@/app/types/common'
import Link from 'next/link'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { Activity, PawPrint } from 'lucide-react'

interface PetLink {
  linkKey?: string
  textKey?: string
  isActive?: boolean
  icon?: React.ReactNode
  gradient?: string
  isPremium?: boolean
}

const petLinks = (path: string): PetLink[] => [
  {
    linkKey: '/guardian/settings/profile',
    textKey: 'Profile',
    isActive: path === '/guardian/settings/profile',
    icon: <PawPrint className="w-4 h-4" />,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    linkKey: '/guardian/settings/account-management',
    textKey: 'Account Management',
    isActive: path === '/guardian/settings/account-management',
    icon: <Activity className="w-4 h-4" />,
    gradient: 'from-red-500 to-orange-500'
  }
]

const GuardianSettingsLayout: FC<ChildrenProps> = ({ children }) => {
  const path = useCustomPathname()

  return (
    <>
      <div className="sticky top-0 pt-6 pl-6 border-b-1 border-b-gray-300 bg-white">
        <span className="text-2xl bg-gradient-to-r from-orange-400 via-orange-600 to-pink-600 bg-clip-text text-transparent font-semibold">
          Settings
        </span>
        <div className="flex items-center gap-x-4">
          {petLinks(path).map((link, i) => (
            <Link
              key={i}
              href={link.linkKey || ''}
              className={`${link.isActive ? 'border-pink-400 text-gray-800' : 'border-transparent text-gray-500'} border-b-3 group relative flex items-center gap-2 py-2 font-medium text-sm whitespace-nowrap`}
            >
              <span className="relative z-10 font-semibold">{link.textKey}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[calc(100dvh-96px)] bg-gray-50">{children}</div>
    </>
  )
}

export default GuardianSettingsLayout
