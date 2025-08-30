import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { backdropVariants } from '@/app/lib/constants'

const Backdrop: FC<{ close: () => void }> = ({ close }) => {
  return (
    <motion.div
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      onClick={close}
    />
  )
}

export default Backdrop
