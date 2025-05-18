import Link from 'next/link'
import React from 'react'
import AwesomeIcon from '../common/AwesomeIcon'
import { facebookIcon } from '@/app/lib/icons'
import useCustomPathname from '@/app/hooks/useCustomPathname'

const Footer = () => {
  const path = useCustomPathname()

  return (
    <div className={`${['/admin', '/guardian'].some((p) => path.startsWith(p)) ? 'hidden' : 'block'} overflow-hidden`}>
      <div className="footer footer-texture">
        <div className="px-4 h-full">
          <div className="max-w-screen-1200 mx-auto w-full gap-y-7 md:gap-y-auto grid-cols-[1fr] grid md:grid-cols-[1fr_2fr_1fr] items-center">
            <h2
              className="text-[52px] font-barlowcondensed uppercase text-articdaisy font-bold"
              style={{ filter: 'drop-shadow(4px 2px 0 #D8A48F)' }}
            >
              Rosie Paws
            </h2>
            <div className="flex items-center gap-x-7 md:justify-center">
              <Link href="/admin/dashboard" className="text-[22px] uppercase font-bold text-articdaisy">
                Admin
              </Link>
              <Link href="/guardian/dashboard" className="text-[22px] uppercase font-bold text-articdaisy">
                Guardian
              </Link>
            </div>
            <div className="flex md:justify-end">
              <div className="w-9 h-9 bg-articdaisy flex items-center justify-center">
                <AwesomeIcon icon={facebookIcon} className="w-5 h-5 text-[#222]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
