'use client'

import React, { FC } from 'react'
import { ChildrenProps } from '@/app/types/common.types'
import Link from 'next/link'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { Heart, Activity, Utensils, Droplets, Pill, Zap, Crown, PawPrint } from 'lucide-react'

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
    linkKey: '/guardian/pets/list',
    textKey: 'My Pets',
    isActive: path === '/guardian/pets/list',
    icon: <PawPrint className="w-4 h-4" />,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    linkKey: '/guardian/pets/pain',
    textKey: 'Pain Scoring',
    isActive: path === '/guardian/pets/pain',
    icon: <Activity className="w-4 h-4" />,
    gradient: 'from-red-500 to-orange-500'
  },
  {
    linkKey: '/guardian/pets/feedings',
    textKey: 'Feedings',
    isActive: path === '/guardian/pets/feedings',
    icon: <Utensils className="w-4 h-4" />,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    linkKey: '/guardian/pets/water',
    textKey: 'Water Intake',
    isActive: path === '/guardian/pets/water',
    icon: <Droplets className="w-4 h-4" />,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    linkKey: '/guardian/pets/medication',
    textKey: 'Medications',
    isActive: path === '/guardian/pets/medication',
    icon: <Pill className="w-4 h-4" />,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    linkKey: '/guardian/pets/blood-sugar',
    textKey: 'Blood Sugar',
    isActive: path === '/guardian/pets/blood-sugar',
    icon: <Heart className="w-4 h-4" />,
    gradient: 'from-pink-500 to-rose-500',
    isPremium: true
  },
  {
    linkKey: '/guardian/pets/seizure',
    textKey: 'Seizure Tracking',
    isActive: path === '/guardian/pets/seizure',
    icon: <Zap className="w-4 h-4" />,
    gradient: 'from-yellow-500 to-orange-500',
    isPremium: true
  }
]

const GuardianPetsLayout: FC<ChildrenProps> = ({ children }) => {
  const path = useCustomPathname()

  return (
    <>
      {/* Enhanced Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-2 px-1 scrollbar-hide">
          {petLinks(path).map((link, i) => (
            <Link
              key={i}
              href={link.linkKey || ''}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap
                ${
                  link.isActive
                    ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg shadow-${
                        link.gradient?.split('-')[1]
                      }-500/25`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {/* Icon Container */}
              <div
                className={`relative flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300
                ${link.isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:text-white'}
              `}
              >
                {/* Gradient overlay for hover effect */}
                {!link.isActive && (
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                )}
                <div className="relative z-10">{link.icon}</div>
              </div>

              {/* Text */}
              <span className="relative z-10 font-semibold">{link.textKey}</span>

              {/* Premium Badge */}
              {link.isPremium && (
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-white">
                  <Crown className="w-2.5 h-2.5" />
                </div>
              )}

              {/* Hover Effect Background */}
              {!link.isActive && (
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
              )}

              {/* Active Indicator Glow */}
              {link.isActive && (
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${link.gradient} opacity-20 blur-sm`} />
              )}
            </Link>
          ))}
        </div>

        {/* Decorative underline */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      {children}
    </>
  )
}

export default GuardianPetsLayout
