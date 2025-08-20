'use client'

import React, { FC } from 'react'
import { IChildren } from '@/app/types/common'
import Link from 'next/link'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { Shield, StethoscopeIcon } from 'lucide-react'

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
    linkKey: '/guardian/settings/vet',
    textKey: 'Vet',
    isActive: path === '/guardian/settings/vet',
    icon: <StethoscopeIcon className="w-4 h-4" />,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    linkKey: '/guardian/settings/account-management',
    textKey: 'Account Management',
    isActive: path === '/guardian/settings/account-management',
    icon: <Shield className="w-4 h-4" />,
    gradient: 'from-red-500 to-orange-500'
  }
]

const GuardianSettingsLayout: FC<IChildren> = ({ children }) => {
  const path = useCustomPathname()

  return (
    <div>
      <div className="sticky top-0 flex items-center justify-between px-6 border-b-1 border-b-gray-100 z-30 bg-white h-[64px]">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {petLinks(path).map((link, i) => (
              <Link
                key={i}
                href={link.linkKey || ''}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  link.isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {link.icon}
                {link.textKey}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[calc(100dvh-64px)] bg-gray-50">{children}</div>
    </div>
  )
}

export default GuardianSettingsLayout
