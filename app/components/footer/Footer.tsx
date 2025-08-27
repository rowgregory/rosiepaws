import React from 'react'
import { motion } from 'framer-motion'
import { MotionLink } from '../common/MotionLink'

const Footer = () => {
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Brand and Newsletter Section */}
          <motion.div className="lg:col-span-2 flex flex-col gap-y-5" variants={fadeInUp}>
            <div onClick={handleScrollToTop} className="cursor-pointer">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">
                Rosie Paws
              </span>
            </div>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
              Providing loving care for your furry family members. From grooming to training, we&apos;re here to keep
              your pets happy and healthy.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Activity Center', 'Resources', 'About'].map((item) => (
                <motion.li key={item}>
                  <motion.a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 block"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <MotionLink
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </MotionLink>
            <MotionLink
              href="/terms-of-service"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
            >
              Terms Of Service
            </MotionLink>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-gray-400">Copyright © {new Date().getFullYear()} Rosie Paws.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
