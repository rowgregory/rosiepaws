'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import useCustomPathname from '@/app/hooks/useCustomPathname'
import MobileMenu from './MobileMenu'
import { navItems } from '@/app/lib/constants/public/header'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const path = useCustomPathname()
  const isHome = path === '/'

  return (
    <div>
      {/* Announcement Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden sm:block bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 text-center py-2 px-4 text-sm font-medium text-white"
      >
        <span className="font-bold">Rosie Paws</span> is here. Compassionate end-of-life care tracking for your beloved
        pets.
      </motion.div>

      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative px-4 sm:px-6 lg:px-8 py-4 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="flex items-center space-x-2"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-contain sm:bg-logo bg-no-repeat bg-center bg-gradient-to-br from-pink-400 via-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm block sm:hidden sm:text-base md:text-xl">RP</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Original Design */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems(path).map((item, index) => (
              <Link href={item.linkKey || ''} key={item.name} className="relative">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className={`${item.isActive ? 'text-pink-600' : isHome ? 'text-white' : 'text-slate-900'} flex items-center space-x-1 hover:bg-gradient-to-r hover:from-red-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-medium`}
                >
                  <span>{item.name}</span>
                </motion.button>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Sign Up Button - Original Desktop Design */}
            {path === '/' ? (
              <Link
                href="/auth/login"
                className="relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-base sm:text-lg text-white backdrop-blur-lg border border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/30"
              >
                <span className="relative z-10">Launch App</span>

                {/* Shiny sweep effect */}
                <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000 ease-out" />

                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-base sm:text-lg text-white backdrop-blur-lg border border-white/10 overflow-hidden group transition-all duration-300 bg-gradient-to-r from-pink-500 to-orange-500"
              >
                <span className="relative z-10">Launch App</span>
              </Link>
            )}

            {/* Mobile Menu Button - Improved for touch */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Toggle navigation menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className={`w-6 h-6 ${isHome ? 'text-white' : 'text-slate-900'}`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className={`w-6 h-6 ${isHome ? 'text-white' : 'text-slate-900'}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu - Professional Design */}
        <MobileMenu isMenuOpen={isMenuOpen} path={path} setIsMenuOpen={setIsMenuOpen} />
      </motion.header>
    </div>
  )
}

export default Header
