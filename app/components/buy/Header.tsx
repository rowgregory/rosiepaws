import { ArrowLeftFromLine } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link
          aria-label="Back to home"
          href="/guardian/home"
          className="inline-flex items-center gap-3 text-slate-600 hover:text-pink-500 transition-colors duration-300 group"
        >
          <ArrowLeftFromLine className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-xl font-bold">
            <span className="text-slate-800">Rosie</span>
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              .Paws
            </span>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Header
