'use client'

import React, { FC } from 'react'
import Title from '@/app/components/admin/Title'
import { ChildrenProps } from '@/app/types/common.types'
import Link from 'next/link'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { useFetchAllPetsQuery } from '@/app/redux/services/petApi'

const petLinks = (path: string) => [
  {
    linkKey: '/admin/pets/list',
    textKey: 'All pets',
    isActive: path === '/admin/pets/list'
  }
]

const PetsLayout: FC<ChildrenProps> = ({ children }) => {
  const path = useCustomPathname()
  useFetchAllPetsQuery({})

  return (
    <div>
      <Title title="Pets" />
      <div className="border-b border-zinc-200 flex flex-col min-w-40 mb-4">
        {petLinks(path).map((link, i) => (
          <Link
            key={i}
            href={link.linkKey}
            className={`group relative font-bold text-sm py-2 w-fit
          ${link.isActive ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-zinc-800'}
        `}
          >
            <span className="relative z-10">{link.textKey}</span>
            <span className="absolute inset-1 duration-300 -ml-2 -mr-2 px-2 rounded-md bg-[#f4f5fb] opacity-0 group-hover:opacity-100 transition -z-10" />
          </Link>
        ))}
      </div>
      {children}
    </div>
  )
}

export default PetsLayout
