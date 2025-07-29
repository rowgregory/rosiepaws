import { Activity } from 'lucide-react'
import { FC } from 'react'
import { motion } from 'framer-motion'

interface IAdminStatCard {
  title: string
  value: string | number
  icon: any
  index: number
  subtitle?: string
  trend?: { value: number; isPositive: boolean }
}

const AdminStatCard: FC<IAdminStatCard> = ({ title, value, icon: Icon, subtitle, trend, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      ease: 'easeOut'
    }}
    whileHover={{
      y: -4,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }}
    className="bg-white rounded-lg border border-gray-200 p-6 transition-shadow duration-200"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
          className="flex items-center gap-3 mb-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.2,
              type: 'spring',
              stiffness: 200
            }}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <Icon className="w-5 h-5 text-gray-700" />
          </motion.div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          className="space-y-1"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.4,
              type: 'spring',
              stiffness: 150
            }}
            className="text-2xl font-bold text-gray-900"
          >
            {value}
          </motion.p>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              className="text-sm text-gray-500"
            >
              {subtitle}
            </motion.p>
          )}

          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
              className="flex items-center gap-1"
            >
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.7,
                  type: 'spring'
                }}
              >
                <Activity className={`w-3 h-3 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`} />
              </motion.div>
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  </motion.div>
)

export default AdminStatCard
