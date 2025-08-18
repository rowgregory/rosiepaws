'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Crown, Star, Heart } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import { publicPetLinks } from '@/app/lib/utils'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'

interface ChildrenProps {
  children: React.ReactNode
}

const linkData = (path: string, userTier: string) =>
  publicPetLinks(path).map((link, index) => {
    let tier: 'free' | 'comfort' | 'legacy' | ''
    let isAccessible = false

    if (index < 4 && index > 0) {
      tier = 'free'
      isAccessible = true
    } else if (index < 7 && index > 3) {
      tier = 'comfort'
      isAccessible = userTier === 'comfort' || userTier === 'legacy'
    } else if (index < 10 && index > 6) {
      tier = 'legacy'
      isAccessible = userTier === 'legacy'
    } else {
      tier = ''
      isAccessible = true
    }

    return {
      ...link,
      tier,
      isAccessible,
      index
    }
  })
const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'free':
      return <Heart className="w-full h-full" />
    case 'comfort':
      return <Star className="w-full h-full" />
    case 'legacy':
      return <Crown className="w-full h-full" />
    default:
      return <Heart className="w-full h-full" />
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'free':
      return 'text-lime-500'
    case 'comfort':
      return 'text-sky-500'
    case 'legacy':
      return 'text-violet-500'
    default:
      return 'text-gray-500'
  }
}

const getTierBg = (tier: string) => {
  switch (tier) {
    case 'free':
      return 'bg-lime-50 border-lime-200'
    case 'comfort':
      return 'bg-sky-50 border-sky-200'
    case 'legacy':
      return 'bg-violet-50 border-violet-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

const GuardianPetsLayout: FC<ChildrenProps> = ({ children }) => {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.user)

  // Determine user tier and access
  const getUserTier = () => {
    if (user?.isLegacyUser) return 'legacy'
    if (user?.isComfortUser) return 'comfort'
    return 'free'
  }

  const userTier = getUserTier()
  const maxAllowed = {
    free: 3,
    comfort: 6,
    legacy: 9
  }[userTier]

  // Get links with tier information
  const linksWithTiers = linkData(path, userTier)

  return (
    <>
      <div className="sticky top-0 h-[64px] px-3 sm:px-6 border-b border-gray-100 z-30 bg-white flex items-center">
        {/* Navigation Links - Main content */}
        <div className="flex items-center gap-x-1 sm:gap-x-2 overflow-x-auto scrollbar-hide flex-1 py-2">
          <div className="flex items-center gap-x-1 sm:gap-x-2 md:max-w-screen-sm lg:max-w-screen-md w-full">
            {linksWithTiers.map((link) => {
              const isActive = link.isActive
              const isAccessible = link.isAccessible
              const showBadge = link.index > 0 // Only show badge for numbered items

              return (
                <motion.div
                  key={link.index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: link.index * 0.05 }}
                  className="relative flex-shrink-0 mt-1"
                >
                  {isAccessible ? (
                    <Link href={link.linkKey || ''} className="block">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md border transition-all duration-200 min-w-0
                          ${
                            isActive
                              ? `${getTierBg(link.tier)} border-current shadow-sm`
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        {/* Tier indicator - smaller on mobile */}
                        <div className={`${getTierColor(link.tier)} hidden xs:block`}>
                          <div className="w-3 h-3">{getTierIcon(link.tier)}</div>
                        </div>

                        <span
                          className={`
                          font-medium text-xs sm:text-sm truncate transition-colors max-w-16 sm:max-w-none
                          ${isActive ? 'text-gray-800' : 'text-gray-600 group-hover:text-gray-800'}
                        `}
                        >
                          {link.textKey}
                        </span>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className={`absolute inset-0 rounded-md border ${getTierColor(link.tier)} border-current`}
                            style={{ borderColor: 'currentColor' }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.div
                      onClick={() => dispatch(setOpenNeedToUpgradeDrawer())}
                      whileHover={{ scale: 1.01 }}
                      className={`
                        relative group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md border border-dashed
                        bg-gray-50 border-gray-300 opacity-60 min-w-0 cursor-pointer`}
                    >
                      {/* Lock icon for inaccessible items */}
                      <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />

                      <span className="font-medium text-xs sm:text-sm text-gray-400 truncate max-w-12 sm:max-w-none">
                        {link.textKey}
                      </span>

                      {/* Upgrade tooltip - only show on hover for larger screens */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        whileHover={{ opacity: 1, scale: 1, y: 0 }}
                        className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
                      >
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        Upgrade to {link.tier}
                        <div className={`flex items-center gap-1 mt-1 ${getTierColor(link.tier)}`}>
                          <div className="w-3 h-3">{getTierIcon(link.tier)}</div>
                          <span className="text-white font-semibold">{link.tier.toUpperCase()}</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Tier badge - only show for numbered items, skip first link */}
                  {showBadge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: link.index * 0.05 + 0.2 }}
                      className={`
                        absolute -top-1 -right-1 transform translate-x-1 -translate-y-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white
                        ${
                          link.tier === 'free'
                            ? 'bg-lime-500'
                            : link.tier === 'comfort'
                              ? 'bg-sky-500'
                              : 'bg-violet-500'
                        }
                      `}
                    >
                      <div className="w-3 h-3">{getTierIcon(link.tier)}</div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Compact tier info on the right */}
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {/* Tier icons only */}
          <div className="hidden sm:flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <Heart className="w-3 h-3 text-lime-500" />
              <Star className="w-3 h-3 text-sky-500" />
              <Crown className="w-3 h-3 text-violet-500" />
            </div>
          </div>

          {/* Usage dots */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 9 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`
                  w-1.5 h-1.5 rounded-full
                  ${
                    index < maxAllowed
                      ? index < 3
                        ? 'bg-green-400'
                        : index < 6
                          ? 'bg-blue-400'
                          : 'bg-purple-400'
                      : 'bg-gray-200'
                  }
                `}
              />
            ))}
          </div>

          {/* Current plan indicator */}
          <div className={`w-2 h-2 rounded-full ${getTierColor(userTier).replace('text-', 'bg-')}`} />
        </div>
      </div>

      <div className="bg-gray-50">{children}</div>
    </>
  )
}

export default GuardianPetsLayout
