'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState, useAppSelector } from '@/app/redux/store'

type TooltipProps = {
  text: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  children: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', children }) => {
  const [visible, setVisible] = useState(false)
  const { guardianActionMenu } = useAppSelector((state: RootState) => state.pet)

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      <AnimatePresence>
        {visible && !guardianActionMenu && (
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              fontSize: '14px',
              padding: '4px 10px',
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.75)',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              ...getPositionStyles(position)
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getPositionStyles(position: string): React.CSSProperties {
  switch (position) {
    case 'top':
      return {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '10px'
      }
    case 'bottom':
      return {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '10px'
      }
    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '10px'
      }
    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '10px'
      }
    default:
      return {}
  }
}

export default Tooltip
