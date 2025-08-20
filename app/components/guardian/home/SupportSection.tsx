import React from 'react'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { setOpenContactSupportDrawer } from '@/app/redux/features/appSlice'
import { useAppDispatch, useUserSelector } from '@/app/redux/store'

const SupportSection = () => {
  const dispatch = useAppDispatch()
  const { user } = useUserSelector()

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('support@rosiepawsapp.com')
      alert('Email copied to clipboard!')
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = 'support@rosiepawsapp.com'
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        if (successful) {
          alert('Email copied to clipboard!')
        } else {
          alert('Failed to copy email. Please copy manually: support@rosiepawsapp.com')
        }
      } catch {
        alert('Failed to copy email. Please copy manually: support@rosiepawsapp.com')
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 text-center"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Getting Started?</h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Our support team is here to help you set up your pet&apos;s profile and get the most out of the platform.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {user?.isFreeUser ? (
          <motion.button
            onClick={copyEmailToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Phone className="w-4 h-4" />
            Copy Support Email
          </motion.button>
        ) : (
          <motion.button
            onClick={() => dispatch(setOpenContactSupportDrawer())}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Phone className="w-4 h-4" />
            Contact Support
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default SupportSection
