import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import { MotionLink } from '../common/MotionLink'
import Link from 'next/link'
import { navItems } from '@/app/lib/constants/public/header'

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 }
}

const MobileMenu: FC<{ isMenuOpen: boolean; path: string; setIsMenuOpen: any }> = ({
  isMenuOpen,
  path,
  setIsMenuOpen
}) => (
  <AnimatePresence>
    {isMenuOpen && (
      <motion.div
        variants={mobileMenuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg overflow-hidden z-50"
      >
        <div className="px-4 py-6 space-y-2 max-w-7xl mx-auto">
          {navItems(path).map((item, index) => (
            <MotionLink
              key={item.name}
              href={item.linkKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className={`flex items-center justify-between px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 ${
                item.isActive
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50 active:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{item.name}</span>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </MotionLink>
          ))}

          {/* Mobile CTA Button */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              href="/auth/login"
              className="block w-full text-center px-6 py-4 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Launch App
            </Link>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default MobileMenu
