'use client'

import React, { FC } from 'react'
import Title from '@/app/components/admin/Title'
import { ChildrenProps } from '@/app/types/common.types'
import Link from 'next/link'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { RootState, useAppSelector } from '@/app/redux/store'

const petLinks = (path: string, role: string): { linkKey?: string; textKey?: string; isActive?: boolean }[] => [
  {
    linkKey: '/guardian/pets/list',
    textKey: 'Pets',
    isActive: path === '/guardian/pets/list'
  },
  {
    linkKey: '/guardian/pets/pain',
    textKey: 'Pain Scoring',
    isActive: path === '/guardian/pets/pain'
  },
  {
    linkKey: '/guardian/pets/food',
    textKey: 'Food Intake',
    isActive: path === '/guardian/pets/food'
  },
  {
    linkKey: '/guardian/pets/water',
    textKey: 'Water Intake',
    isActive: path === '/guardian/pets/water'
  },
  {
    linkKey: '/guardian/pets/medication',
    textKey: 'Medication Schedule',
    isActive: path === '/guardian/pets/medication'
  },
  {
    ...(role === 'premium_user' && {
      linkKey: '/guardian/pets/blood-sugar',
      textKey: 'Blood Sugar Tracking',
      isActive: path === '/guardian/pets/blood-sugar'
    })
  },
  {
    ...(role === 'premium_user' && {
      linkKey: '/guardian/pets/seizure',
      textKey: 'Seizure Tracking',
      isActive: path === '/guardian/pets/seizure'
    })
  }
]

const GuardianPetsLayout: FC<ChildrenProps> = ({ children }) => {
  const path = useCustomPathname()
  const { role } = useAppSelector((state: RootState) => state.auth)
  console.log(role)

  return (
    <>
      <Title title="My Pets" />
      <div className="border-b border-zinc-200 flex items-center gap-x-5 min-w-40 mb-4">
        {petLinks(path, role).map((link, i) => (
          <Link
            key={i}
            href={link.linkKey || ''}
            className={`group relative font-semibold text-sm py-2 w-fit
          ${link.isActive ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-[#73767f]'}
        `}
          >
            <span className="relative z-10">{link.textKey}</span>
            <span className="absolute inset-1 duration-300 -ml-2 -mr-2 px-2 rounded-md bg-[#f4f5fb] opacity-0 group-hover:opacity-100 transition -z-10" />
          </Link>
        ))}
      </div>
      {children}
    </>
  )
}

export default GuardianPetsLayout
