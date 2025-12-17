import { FC, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { drawerVariants } from '@/app/lib/constants'

const DrawerStyles = `min-h-dvh w-full max-w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col`

const Drawer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <motion.div variants={drawerVariants} initial="initial" animate="animate" exit="exit" className={DrawerStyles}>
      {children}
    </motion.div>
  )
}

export default Drawer
