import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, MapPin, Moon, Sun } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const handleSubmit = () => {
    // Handle newsletter signup
    setEmail('')
  }

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
          <motion.div className="lg:col-span-2" variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <h3 className="text-2xl font-bold">Rosie Paws</h3>
            </div>

            <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
              Providing loving care for your furry family members. From grooming to training, we&apos;re here to keep
              your pets happy and healthy.
            </p>

            <div>
              <h4 className="text-xl font-semibold mb-4">Join Our Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Here"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <motion.button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Services', 'About Us', 'Contact', 'Booking', 'Reviews', 'Gallery'].map((item) => (
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

          {/* Services */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-xl font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {['Pet Grooming', 'Dog Training', 'Pet Sitting', 'Veterinary Care', 'Pet Boarding', 'Emergency Care'].map(
                (item) => (
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
                )
              )}
            </ul>
          </motion.div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-300">123 Pet Street, Animal City</p>
                <p className="text-gray-300">North America, USA</p>
              </div>
            </motion.div>

            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-300">hello@rosiepaws.com</p>
              </div>
            </motion.div>

            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-300">+1 555-PAWS-CARE</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
            >
              Terms And Conditions
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
            >
              Contact Us
            </motion.a>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-gray-400">Copyright © 2025 Rosie Paws.</p>

            <motion.button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
