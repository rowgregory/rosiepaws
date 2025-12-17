import { FC } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { setToggleNavigation } from '@/app/redux/features/appSlice'
import { useAppDispatch } from '@/app/redux/store'

interface IToggleButton {
  toggleSidebar: boolean
}

const ToggleButton: FC<IToggleButton> = ({ toggleSidebar }) => {
  const dispatch = useAppDispatch()

  return (
    <motion.button
      onClick={() => dispatch(setToggleNavigation(toggleSidebar))}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
    >
      <motion.div animate={{ rotate: toggleSidebar ? 0 : 180 }} transition={{ duration: 0.3 }}>
        <ChevronRight className="w-3 h-3" />
      </motion.div>
    </motion.button>
  )
}

export default ToggleButton
