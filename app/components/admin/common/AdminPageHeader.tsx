import { Download, RefreshCcw } from 'lucide-react'
import { FC } from 'react'
import { motion } from 'framer-motion'

const AdminPageHeader: FC<{ title: string; subtitle: string; onExport?: any; isLoading?: boolean }> = ({
  title,
  subtitle,
  onExport,
  isLoading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-gray-900"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-600"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="flex items-center gap-3 mt-4 lg:mt-0"
      >
        <motion.button
          onClick={onExport}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: -5 }} transition={{ duration: 0.2 }}>
            {title === 'System Logs' ? (
              <RefreshCcw className={`${isLoading ? 'animate-spin' : ''} w-4 h-4`} />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </motion.div>
          {title === 'System Logs' ? 'Refresh' : 'Export'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default AdminPageHeader
