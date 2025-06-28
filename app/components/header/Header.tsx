'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Settings } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<null | string>(null)

  const navItems = [{ name: 'Home' }, { name: 'Services', hasDropdown: true }, { name: 'Blog' }]

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  }

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Announcement Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 text-center py-2 px-4 text-sm font-medium text-white"
      >
        <span className="font-bold">Rosie Paws</span> is here. Compassionate end-of-life care tracking for your beloved
        pets.
      </motion.div>

      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative px-4 sm:px-6 lg:px-8 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="flex items-center space-x-2"
          >
            <div className="w-20 h-20 bg-contain bg-logo bg-no-repeat bg-center" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center space-x-1 text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-medium"
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <motion.div
                      animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-700" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.name && item.hasDropdown && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2 z-50"
                    >
                      {['Option 1', 'Option 2', 'Option 3'].map((option) => (
                        <motion.a
                          key={option}
                          href="#"
                          whileHover={{ x: 4, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-150"
                        >
                          {option}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Settings Icon */}
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="p-2 text-gray-700 hover:text-red-500 transition-all duration-300"
            >
              <Settings className="w-5 h-5 hover:stroke-red-500" />
            </motion.button>

            {/* Sign Up Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 px-6 py-2 rounded-full font-semibold hover:from-red-500 hover:via-pink-500 hover:to-orange-500 transition-all duration-200 text-white"
            >
              Sign Up
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-200"
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
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  >
                    <span className="font-medium">{item.name}</span>
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  )
}

export default Header
