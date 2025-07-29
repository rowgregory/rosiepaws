import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { IAppointment } from '@/app/types'
import { serviceTypeConfig, statusConfig } from '@/app/lib/constants/public/appointment'
import { getTimeInfo } from '@/app/lib/utils'

const RecentActivity: FC<{ appointments: IAppointment[] }> = ({ appointments }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {appointments?.slice(0, 8).map((appointment, index) => {
          const serviceConfig = serviceTypeConfig[appointment.serviceType]
          const statusDisplay = statusConfig[appointment.status]

          return (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{appointment?.pet?.name}</div>
                  <div className="text-xs text-gray-500">{getTimeInfo(appointment?.createdAt)?.relative}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg">{serviceConfig.icon}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${statusDisplay.color}`}>{statusDisplay.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default RecentActivity
