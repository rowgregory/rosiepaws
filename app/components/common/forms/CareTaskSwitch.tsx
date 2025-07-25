import { CheckCircle, Info } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'

const CareTaskExplanation = ({ isVisible, onClose }: any) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onClick={onClose}
          className="fixed top-[-40px] inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What are Care Tasks?</h3>
            </div>

            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Care Tasks</strong> are automatic reminders that help you stay on top of your pet&apos;s health
                routine.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">When you enable this:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Creates a task on your home page</li>
                  <li>• Visible immediately when you log in</li>
                  <li>• Helps you stay on top of care activities</li>
                  <li>• Can be checked off when completed</li>
                </ul>
              </div>

              <p className="text-sm font-medium text-gray-700">
                Toggle the switch to create a home page task for this activity.
              </p>
            </div>

            <div className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium">
              Got it!
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const CareTaskSwitch = ({ value = false, handleToggle, disabled = false, showInfo = true, className = '' }: any) => {
  const [showExplanation, setShowExplanation] = useState(false)
  const checkboxRef = useRef(null) as any

  return (
    <>
      {/* Explanation Modal */}
      <CareTaskExplanation isVisible={showExplanation} onClose={() => setShowExplanation(false)} />
      <div className={`flex items-center justify-between py-2 ${className}`}>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <label className="font-medium text-gray-800 cursor-pointer select-none" onClick={handleToggle}>
              Create Care Task
            </label>
            {showInfo && (
              <button
                onClick={() => setShowExplanation(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="What are care tasks?"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
            {value && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-sm text-gray-600 mt-1">Create a care task that appears on your home page</p>
        </div>

        {/* Toggle Switch */}
        <motion.button
          onClick={() => checkboxRef.current.click()}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 ml-4 ${
            value ? 'bg-gradient-to-r from-pink-500 to-orange-500' : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <input
            ref={checkboxRef}
            type="checkbox"
            className="hidden"
            name="isCareTask"
            checked={value || false}
            readOnly
            onChange={handleToggle}
          />
          <motion.span
            className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
            animate={{ x: value ? 24 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>
    </>
  )
}

export default CareTaskSwitch
