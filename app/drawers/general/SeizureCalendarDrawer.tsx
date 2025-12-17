import { drawerVariants, overlayVariants, SeizureSeverity } from '@/app/lib/constants'
import { changeMonth, formatDateShort, formatSeizureDate, getCalendarDays, getSeverityColor } from '@/app/lib/utils'
import { setCloseSeizureCalendarDrawer } from '@/app/redux/features/dashboardSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { ISeizure } from '@/app/types'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useState } from 'react'

const SeizureCalendarDrawer: FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { seizures } = useAppSelector((state: RootState) => state.seizure)
  const { seizureCalendarDrawer } = useAppSelector((state: RootState) => state.dashboard)
  const [seizureRecords] = useState<ISeizure[]>(seizures)
  const dispatch = useAppDispatch()

  // Group seizures by date
  const seizuresByDate = seizureRecords.reduce(
    (acc, seizure) => {
      const dateKey = formatSeizureDate(new Date(seizure.timeRecorded))
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(seizure)
      return acc
    },
    {} as Record<string, ISeizure[]>
  )

  // Generate calendar days for the current month
  const calendarDays = getCalendarDays(currentDate)

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {seizureCalendarDrawer && (
          <motion.div
            key="overlay"
            initial={overlayVariants.initial}
            animate={overlayVariants.animate}
            exit={overlayVariants.exit}
            className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-40"
            onClick={() => dispatch(setCloseSeizureCalendarDrawer())}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {seizureCalendarDrawer && (
          <motion.div
            key="drawer"
            initial={drawerVariants.initial}
            animate={drawerVariants.animate}
            exit={drawerVariants.exit}
            className={`
              fixed top-0 left-0 h-full w-[500px] max-w-[90%] bg-white shadow-xl z-50 
            `}
          >
            <div className="p-4 bg-gradient-to-r from-red-400 to-pink-500 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Seizure Calendar</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(setCloseSeizureCalendarDrawer())}
                className="text-white p-2 rounded"
              >
                ✕
              </motion.button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => changeMonth('prev', setCurrentDate)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ← Prev
                </motion.button>
                <h3 className="text-lg font-semibold">{formatSeizureDate(currentDate, 'MMMM yyyy')}</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => changeMonth('next', setCurrentDate)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Next →
                </motion.button>
              </div>

              {/* Calendar Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-7 gap-2 text-center"
              >
                {/* Weekday Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="font-semibold text-gray-600">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day) => {
                  const dateString = formatSeizureDate(day)
                  const seizuresOnDay = seizuresByDate[dateString] || []
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()

                  // If multiple seizures, use the highest severity
                  const highestSeveritySeizure =
                    seizuresOnDay.length > 0
                      ? seizuresOnDay.reduce((highest, current) =>
                          highest.severity === SeizureSeverity.SEVERE
                            ? highest
                            : current.severity === SeizureSeverity.SEVERE
                              ? current
                              : highest.severity === SeizureSeverity.CRITICAL
                                ? highest
                                : current
                        )
                      : null

                  return (
                    <motion.div
                      key={dateString}
                      whileHover={{ scale: 1.05 }}
                      className={`
                        border p-2 h-20 relative
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                        ${highestSeveritySeizure ? getSeverityColor(highestSeveritySeizure.severity) : 'bg-white'}
                      `}
                    >
                      {/* Day Number */}
                      <div className="text-sm">{formatSeizureDate(day, 'd')}</div>

                      {/* Seizure Indicator */}
                      {seizuresOnDay.length > 0 && isCurrentMonth && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-1 right-1">
                          <span className="text-xs font-bold text-gray-700 flex flex-col">
                            {seizuresOnDay.length}
                            <span className="ml-1 text-[10px] uppercase">{highestSeveritySeizure?.severity}</span>
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Severity Legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 flex justify-center space-x-4 text-xs"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 bg-yellow-100 border"></div>
                  <span>Mild</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 bg-orange-100 border"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 bg-red-200 border"></div>
                  <span>Severe</span>
                </div>
              </motion.div>

              {/* Detailed Seizure Log */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <h4 className="text-lg font-semibold mb-3">Detailed Seizure Log</h4>
                {Object.entries(seizuresByDate)
                  .filter(([date]) => {
                    const seizureDate = new Date(date)
                    return (
                      seizureDate.getMonth() === currentDate.getMonth() &&
                      seizureDate.getFullYear() === currentDate.getFullYear()
                    )
                  })
                  .map(([date, seizures]) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="mb-4"
                    >
                      <div className="font-medium mb-2">{formatDateShort(date)}</div>
                      {seizures.map((seizure) => (
                        <motion.div
                          key={seizure.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-100 p-2 rounded mb-2 flex justify-between"
                        >
                          <div>
                            <div className="text-sm">
                              <span className="font-semibold">{seizure.seizureType}</span>
                              {' - '}
                              <span
                                className={`
                                ${
                                  seizure.severity === SeizureSeverity.MILD
                                    ? 'text-yellow-600'
                                    : seizure.severity === SeizureSeverity.MODERATE
                                      ? 'text-orange-600'
                                      : 'text-red-600'
                                }
                              `}
                              >
                                {seizure.severity}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Time: {new Date(seizure.timeRecorded).toLocaleTimeString()}
                            </div>
                            {seizure.notes && <div className="text-xs text-gray-700 mt-1">Notes: {seizure.notes}</div>}
                          </div>
                          <div className="text-xs text-gray-500">Duration: {seizure.duration} sec</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SeizureCalendarDrawer
