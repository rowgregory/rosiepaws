import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { faqData } from '@/app/lib/constants'

const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([0]) // First item expanded by default

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      {/* FAQ Section */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 pr-4">{faq.question}</h4>
                  {expandedItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <div className="pt-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default FAQ
