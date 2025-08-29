import React, { FC } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const CollapsedProfileIndicator: FC<{ toggleSidebar: boolean; setPetDropdownOpen: any; initial: string }> = ({
  toggleSidebar,
  setPetDropdownOpen,
  initial
}) => {
  return (
    <AnimatePresence>
      {toggleSidebar && (
        <motion.div
          onClick={() => setPetDropdownOpen(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-0 bottom-4 flex justify-center cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-white uppercase">{initial}</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CollapsedProfileIndicator
