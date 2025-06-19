import React, { useMemo } from 'react'
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Pill, Bell } from 'lucide-react'

interface GuardianMedicationGraphProps {
  medicationData: any
}

const GuardianMedicationGraph: React.FC<GuardianMedicationGraphProps> = ({ medicationData = [] }) => {
  // Process data for charts
  const chartData = useMemo(() => {
    if (!medicationData.length) return { daily: [], reminders: [], dosageTypes: [] }

    // Group by date for daily reminder tracking
    const dailyData = new Map()
    const reminderData = { enabled: 0, disabled: 0 }
    const dosageTypeCount = new Map()

    medicationData.forEach((med: any) => {
      const date = med.date

      // Daily reminder count
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          remindersSent: 0,
          medicationsWithReminders: 0,
          totalMedications: 0
        })
      }

      const dayData = dailyData.get(date)
      dayData.totalMedications += 1
      dayData.remindersSent += med.sentRemindersToday || 0

      if (med.reminderEnabled) {
        dayData.medicationsWithReminders += 1
      }

      // Reminder status
      if (med.reminderEnabled) {
        reminderData.enabled += 1
      } else {
        reminderData.disabled += 1
      }

      // Dosage type distribution (e.g., "2 drops", "1 tablet")
      const dosageType = `${med.dosage} ${med.dosageUnit} of ${med.drugName}`
      dosageTypeCount.set(dosageType, (dosageTypeCount.get(dosageType) || 0) + 1)
    })

    // Convert to arrays
    const dailyArray = Array.from(dailyData.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const reminderArray = [
      { type: 'Enabled', count: reminderData.enabled, color: '#10b981' },
      { type: 'Disabled', count: reminderData.disabled, color: '#6b7280' }
    ].filter((item) => item.count > 0)

    const dosageTypeArray = Array.from(dosageTypeCount.entries())
      .map(([type, count]) => ({
        type: type,
        count
      }))
      .sort((a, b) => b.count - a.count)

    return { daily: dailyArray, reminders: reminderArray, dosageTypes: dosageTypeArray }
  }, [medicationData])

  const totalRemindersToday = medicationData.reduce(
    (sum: any, med: any) => sum + (med?.sentRemindersToda?.length || 0),
    0
  )

  // Custom tooltip for dosage types
  const DosageTypeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.type}</p>
          <p className="text-blue-600">
            <span className="font-medium">{data.drugName}</span>
          </p>
        </div>
      )
    }
    return null
  }

  if (!medicationData.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Medication Schedule</h3>
              <p className="text-sm text-gray-600">Manage medication reminders and schedules</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">--</div>
            <div className="text-sm text-gray-500">No Medications</div>
          </div>
        </div>

        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-blue-500" />
            </div>
            <p className="font-medium">No medications scheduled</p>
            <p className="text-sm">Add medications to set up reminders</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Medication Schedule</h3>
            <p className="text-sm text-gray-600">Manage medication reminders and schedules</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{totalRemindersToday}</div>
          <div className="text-sm text-gray-500">Reminders Today</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Medication List Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Current Medications</h4>
          <div className="h-[250px] overflow-y-auto bg-gray-50 rounded-lg p-3">
            <div className="space-y-3">
              {medicationData.map((med: any, idx: number) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{med.drugName}</p>
                        <p className="text-xs text-gray-600">
                          {med.dosage} {med.dosageUnit}
                        </p>
                        <p className="text-xs text-blue-600">{med.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {med.reminderEnabled && (
                        <div className="flex items-center gap-1">
                          <Bell className="w-3 h-3 text-green-500" />
                          {med.sentRemindersToday > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                              {med.sentRemindersToday}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {medicationData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No medications scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dosage Types Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Dosage Types</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.dosageTypes.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {chartData.dosageTypes.slice(0, 6).map((entry, index) => {
                  const colors = [
                    '#3b82f6', // blue-500
                    '#8b5cf6', // violet-500
                    '#06b6d4', // cyan-500
                    '#10b981', // emerald-500
                    '#f59e0b', // amber-500
                    '#ef4444' // red-500
                  ]
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                })}
              </Pie>
              <Tooltip
                content={<DosageTypeTooltip />}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {chartData.dosageTypes.slice(0, 6).map((dosage, index) => {
              const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
              return (
                <div key={dosage.type} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span>{dosage.type.split('of')[0]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuardianMedicationGraph
