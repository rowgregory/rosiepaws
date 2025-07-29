'use client'

import React, { FC } from 'react'
import { ChildrenProps } from '@/app/types/common'
import Link from 'next/link'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { publicPetLinks } from '@/app/lib/utils'

const GuardianPetsLayout: FC<ChildrenProps> = ({ children }) => {
  const path = useCustomPathname()

  return (
    <>
      <div className="sticky top-0 pt-6 pl-6 border-b-1 border-b-gray-300 z-30 bg-white">
        <span className="text-2xl bg-gradient-to-r from-orange-400 via-orange-600 to-pink-600 bg-clip-text text-transparent font-semibold">
          Pets
        </span>
        <div className="flex items-center gap-x-4">
          {publicPetLinks(path).map((link, i) => (
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
      <div className="bg-gray-50">{children}</div>
    </>
  )
}

export default GuardianPetsLayout
