'use client'

import useCustomPathname from '@/app/hooks/useCustomPathname'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  const path = useCustomPathname()

  return (
    <header
      className={`${
        ['/admin', '/guardian'].some((p) => path.startsWith(p)) ? 'hidden' : 'block'
      } relative bg-[#fffdf8] bg-homeherotexture2 bg-repeat bg-contain bg-center h-[92px] w-full flex items-center justify-center after:absolute after:content-[''] after:w-11/12 after:h-2 after:bg-roseblush after:top-0 after:rounded-br-3xl after:rounded-bl-3xl after:bg-homeherotexture2`}
    >
      {/* Side links closer to the logo */}
      <div className="flex justify-between w-full max-w-[800px] px-4 z-20">
        <Link
          href="/admin/dashboard"
          className="mt-3 uppercase font-barlowcondensed text-roseblush font-bold text-[30px] text-shadow hover:text-olivepetal -mr-6 hidden 1200:block"
        >
          Admin
        </Link>
        <Link
          href="/guardian/dashboard"
          className="mt-3 uppercase font-barlowcondensed text-roseblush font-bold text-[30px] text-shadow hover:text-olivepetal -ml-6 hidden 1200:block"
        >
          Guardian
        </Link>
      </div>

      {/* Absolutely centered logo */}
      <Link
        href="/"
        className="bg-headerlogo bg-no-repeat bg-center bg-cover h-[92px] w-[300px] absolute left-1/2 -translate-x-1/2 z-30 -mb-8"
      />
    </header>
  )
}

export default Header
