import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqData } from '@/app/lib/constants'

const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([0]) // First item expanded by default

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="group border border-gray-200 rounded-2xl bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-300"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors pr-4">
                  {faq.question}
                </h3>
                <div
                  className={`transform transition-transform duration-300 ${
                    expandedItems.includes(index) ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-purple-600" />
                </div>
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-8 pb-6 border-t border-gray-100 mt-2 overflow-y-auto h-60">
                <div className="pt-6">
                  <p className="text-gray-700 leading-7 text-base">{faq.answer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default FAQ
