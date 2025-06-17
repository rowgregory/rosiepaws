import React from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/app/redux/store'
import { Plus } from 'lucide-react'

const GuardianPageHeader = ({
  Icon,
  data,
  title,
  subtitle,
  setOpenDrawer,
  btnText,
  overlayGradient,
  iconGradient,
  buttonGradient
}: any) => {
  const getTodaysLogs = () => {
    const today = new Date().toDateString()
    return data?.filter((log: any) => new Date(log.createdAt).toDateString() === today).length
  }
  const dispatch = useAppDispatch()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      <div className={`${overlayGradient} absolute inset-0`} />
      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`${iconGradient} p-4 rounded-2xl shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Quick Stats */}
            {data?.length > 0 && (
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{data?.length}</div>
                  <div className="text-sm text-gray-500">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{getTodaysLogs()}</div>
                  <div className="text-sm text-gray-500">Today&apos;s Logs</div>
                </div>
              </div>
            )}

            {/* Add Water Button */}
            <motion.button
              onClick={() => dispatch(setOpenDrawer())}
              className={`${buttonGradient} group flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl bg-gray-100 text-white hover:scale-105'
                         }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className={`w-5 h-5 group-hover:rotate-90 transition-transform duration-300`} />
              <span>Add {btnText}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GuardianPageHeader
