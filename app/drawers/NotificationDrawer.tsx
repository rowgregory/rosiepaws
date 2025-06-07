import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  X,
  Pill,
  Heart,
  Utensils,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Activity,
  Trash2
} from 'lucide-react'

// Notification types for pet care
type NotificationType =
  | 'medication_reminder'
  | 'feeding_time'
  | 'water_refill'
  | 'vet_appointment'
  | 'health_alert'
  | 'activity_goal'
  | 'weight_check'
  | 'general'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  petName?: string
  actionRequired?: boolean
  priority: 'low' | 'medium' | 'high'
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'medication_reminder',
    title: 'Medication Time',
    message: 'Time to give Bella her insulin shot',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    petName: 'Bella',
    actionRequired: true,
    priority: 'high'
  },
  {
    id: '2',
    type: 'feeding_time',
    title: 'Feeding Reminder',
    message: 'Max is due for his evening meal',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isRead: false,
    petName: 'Max',
    actionRequired: true,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'vet_appointment',
    title: 'Upcoming Appointment',
    message: 'Luna has a checkup tomorrow at 2:00 PM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    petName: 'Luna',
    actionRequired: false,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'health_alert',
    title: 'Health Alert',
    message: "Charlie's pain score has been elevated for 2 days",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    petName: 'Charlie',
    actionRequired: true,
    priority: 'high'
  },
  {
    id: '5',
    type: 'water_refill',
    title: 'Water Bowl Empty',
    message: "Milo's water bowl needs refilling",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    petName: 'Milo',
    actionRequired: false,
    priority: 'low'
  }
]

// Notification icon mapping
const getNotificationIcon = (type: NotificationType) => {
  const iconMap = {
    medication_reminder: <Pill className="w-4 h-4" />,
    feeding_time: <Utensils className="w-4 h-4" />,
    water_refill: <Droplets className="w-4 h-4" />,
    vet_appointment: <Calendar className="w-4 h-4" />,
    health_alert: <Heart className="w-4 h-4" />,
    activity_goal: <Activity className="w-4 h-4" />,
    weight_check: <Activity className="w-4 h-4" />,
    general: <Bell className="w-4 h-4" />
  }
  return iconMap[type] || iconMap.general
}

// Notification color mapping
const getNotificationColors = (type: NotificationType) => {
  const baseColors = {
    medication_reminder: 'from-blue-500 to-indigo-500',
    feeding_time: 'from-green-500 to-emerald-500',
    water_refill: 'from-cyan-500 to-blue-500',
    vet_appointment: 'from-purple-500 to-pink-500',
    health_alert: 'from-red-500 to-orange-500',
    activity_goal: 'from-yellow-500 to-orange-500',
    weight_check: 'from-indigo-500 to-purple-500',
    general: 'from-gray-500 to-gray-600'
  }

  return baseColors[type] || baseColors.general
}

// Time formatting helper
const formatTimeAgo = (timestamp: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const priorityNotifications = notifications.filter((n) => n.priority === 'high' && !n.isRead)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-600">{unreadCount} unread</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Action buttons */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Priority Alerts */}
            {priorityNotifications.length > 0 && (
              <div className="p-4 bg-red-50 border-b border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Priority Alerts</span>
                </div>
                <p className="text-xs text-red-600">
                  {priorityNotifications.length} urgent notification{priorityNotifications.length > 1 ? 's' : ''}{' '}
                  require attention
                </p>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bell className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">All caught up!</p>
                  <p className="text-sm text-center px-8">
                    No new notifications right now. We&apos;ll let you know when something needs your attention.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                        notification.isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 shadow-sm'
                      }`}
                    >
                      {/* Priority indicator */}
                      {notification.priority === 'high' && !notification.isRead && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}

                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getNotificationColors(
                            notification.type
                          )} flex items-center justify-center flex-shrink-0`}
                        >
                          <div className="text-white">{getNotificationIcon(notification.type)}</div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              className={`font-medium text-sm ${
                                notification.isRead ? 'text-gray-600' : 'text-gray-900'
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>

                          <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>

                          {notification.petName && (
                            <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {notification.petName}
                            </span>
                          )}

                          {notification.actionRequired && !notification.isRead && (
                            <div className="mt-3 flex gap-2">
                              <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200">
                                Take Action
                              </button>
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200"
                              >
                                Mark as read
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-red-50 hover:text-red-500 rounded transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Usage Example Component
const NotificationExample = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const unreadCount = sampleNotifications.filter((n) => !n.isRead).length

  return (
    <div className="p-8">
      <button
        onClick={() => setIsNotificationOpen(true)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      <NotificationDrawer isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  )
}

export default NotificationExample
