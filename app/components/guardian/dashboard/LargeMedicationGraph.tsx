import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Pill, Bell, TrendingUp, Calendar, AlertTriangle, Activity } from 'lucide-react'

interface LargeMedicationGraphProps {
  medicationData?: any[]
}

const LargeMedicationGraph: React.FC<LargeMedicationGraphProps> = ({ medicationData = [] }) => {
  const chartData = useMemo(() => {
    if (!medicationData.length)
      return {
        daily: [],
        reminders: [],
        dosageTypes: [],
        frequency: [],
        upcomingExpiry: [],
        prescribers: [],
        stats: {
          totalMedications: 0,
          activeReminders: 0,
          averageRemindersPerDay: 0,
          expiringSoon: 0,
          longTermMedications: 0,
          dailyMedications: 0,
          prescribersCount: 0
        }
      }

    const now = new Date()
    const dailyData = new Map()
    const reminderData = { enabled: 0, disabled: 0 }
    const dosageTypeCount = new Map()
    const frequencyCount = new Map()
    const prescriberCount = new Map()
    const upcomingExpiryData: any = []

    let expiringSoonCount = 0
    let longTermCount = 0
    let dailyMedicationsCount = 0
    let totalRemindersSent = 0

    medicationData.forEach((med: any) => {
      const date = med.date || new Date().toISOString().split('T')[0]
      const startDate = new Date(med.startDate)
      const endDate = med.endDate ? new Date(med.endDate) : null

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
      dayData.remindersSent += med.sentRemindersToday?.length || 0

      if (med.reminderEnabled) {
        dayData.medicationsWithReminders += 1
      }

      totalRemindersSent += med.sentRemindersToday?.length || 0

      // Reminder status
      if (med.reminderEnabled) {
        reminderData.enabled += 1
      } else {
        reminderData.disabled += 1
      }

      // Dosage type distribution
      const dosageType = `${med.dosage} ${med.dosageUnit}`
      dosageTypeCount.set(dosageType, (dosageTypeCount.get(dosageType) || 0) + 1)

      // Frequency distribution
      const frequency = med.frequency || 'Not specified'
      frequencyCount.set(frequency, (frequencyCount.get(frequency) || 0) + 1)

      // Prescriber distribution
      const prescriber = med.prescribedBy || 'Not specified'
      prescriberCount.set(prescriber, (prescriberCount.get(prescriber) || 0) + 1)

      // Check for expiring medications (within 7 days)
      if (endDate) {
        const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
          expiringSoonCount += 1
          upcomingExpiryData.push({
            drugName: med.drugName,
            daysUntilExpiry,
            endDate: endDate.toLocaleDateString()
          })
        }
      }

      // Long-term medications (more than 30 days)
      if (endDate) {
        const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        if (duration > 30) {
          longTermCount += 1
        }
      }

      // Daily medications
      if (med.frequency === 'once_daily' || med.frequency === 'twice_daily' || med.frequency === 'three_times_daialy') {
        dailyMedicationsCount += 1
      }
    })

    // Convert to arrays
    const dailyArray = Array.from(dailyData.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Calculate average reminders per day
    const averageRemindersPerDay = dailyArray.length > 0 ? totalRemindersSent / Math.max(dailyArray.length, 1) : 0

    const reminderArray = [
      { type: 'Enabled', count: reminderData.enabled, color: '#10b981' },
      { type: 'Disabled', count: reminderData.disabled, color: '#6b7280' }
    ].filter((item) => item.count > 0)

    const dosageTypeArray = Array.from(dosageTypeCount.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    const frequencyArray = Array.from(frequencyCount.entries())
      .map(([frequency, count]) => ({ frequency, count }))
      .sort((a, b) => b.count - a.count)

    const prescriberArray = Array.from(prescriberCount.entries())
      .map(([prescriber, count]) => ({ prescriber, count }))
      .sort((a, b) => b.count - a.count)

    return {
      daily: dailyArray,
      reminders: reminderArray,
      dosageTypes: dosageTypeArray,
      frequency: frequencyArray,
      upcomingExpiry: upcomingExpiryData.sort((a: any, b: any) => a.daysUntilExpiry - b.daysUntilExpiry),
      prescribers: prescriberArray,
      stats: {
        totalMedications: medicationData.length,
        activeReminders: reminderData.enabled,
        averageRemindersPerDay: Math.round(averageRemindersPerDay * 10) / 10,
        expiringSoon: expiringSoonCount,
        longTermMedications: longTermCount,
        dailyMedications: dailyMedicationsCount,
        prescribersCount: prescriberCount.size
      }
    }
  }, [medicationData])

  const totalRemindersToday = medicationData.reduce(
    (sum: any, med: any) => sum + (med?.sentRemindersToday?.length || 0),
    0
  )

  // Custom tooltip components
  const FrequencyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.frequency}</p>
          <p className="text-blue-600">
            <span className="font-medium">{data.count}</span> medications
          </p>
        </div>
      )
    }
    return null
  }

  const DosageTypeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.count / medicationData.length) * 100).toFixed(1)

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-800 mb-1">{data.type}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              <span className="font-medium">{data.count}</span> medication{data.count !== 1 ? 's' : ''}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">{percentage}%</span> of total medications
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const { stats } = chartData

  return (
    <div className="bg-white lg:rounded-xl lg:shadow-sm border border-gray-100 p-3 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Medication Analytics</h3>
            <p className="text-sm text-gray-600">Comprehensive medication management insights</p>
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:text-right">
          <div className="text-2xl font-bold text-blue-600">{totalRemindersToday}</div>
          <div className="text-sm text-gray-500">Reminders Today</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Frequency Distribution Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Frequency Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.frequency}>
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<FrequencyTooltip />} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dosage Types Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Dosage Types</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <defs>
                <linearGradient id="pieGradient0" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="pieGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="pieGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="pieGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="pieGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="pieGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <Pie
                data={chartData.dosageTypes.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {chartData.dosageTypes.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGradient${index})`} />
                ))}
              </Pie>
              <Tooltip content={<DosageTypeTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {chartData.dosageTypes.slice(0, 6).map((dosage, index) => {
              const gradientColors = [
                { start: '#6366f1', end: '#8b5cf6' },
                { start: '#7c3aed', end: '#a855f7' },
                { start: '#06b6d4', end: '#3b82f6' },
                { start: '#10b981', end: '#059669' },
                { start: '#f59e0b', end: '#d97706' },
                { start: '#ef4444', end: '#dc2626' }
              ]
              return (
                <div key={dosage.type} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: `linear-gradient(45deg, ${gradientColors[index % gradientColors.length].start}, ${gradientColors[index % gradientColors.length].end})`
                    }}
                  ></div>
                  <span>{dosage.type}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Pill className="w-4 h-4 text-blue-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-blue-600">{stats.totalMedications}</div>
          <div className="text-xs text-gray-600">Total Medications</div>
        </div>

        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-amber-600">{stats.expiringSoon}</div>
          <div className="text-xs text-gray-600">Expiring Soon</div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-4 h-4 text-green-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-green-600">{stats.activeReminders}</div>
          <div className="text-xs text-gray-600">Active Reminders</div>
        </div>
        <div className="text-center p-3 bg-cyan-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-cyan-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-cyan-600">{stats.dailyMedications}</div>
          <div className="text-xs text-gray-600">Daily Meds</div>
        </div>

        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600 mr-1" />
          </div>
          <div className="text-lg font-bold text-indigo-600">{stats.prescribersCount}</div>
          <div className="text-xs text-gray-600">Prescribers</div>
        </div>
      </div>

      {/* Expiring Medications Alert */}
      {chartData.upcomingExpiry.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Expiring Soon
          </h4>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="space-y-2">
              {chartData.upcomingExpiry.map((med: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-900">{med.drugName}</span>
                  <span className="text-xs text-amber-700">
                    {med.daysUntilExpiry} days ({med.endDate})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current Medications List */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Current Medications</h4>
        <div className="h-[200px] overflow-y-auto bg-gray-50 rounded-lg p-3">
          <div className="space-y-3">
            {medicationData.map((med: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{med.drugName}</p>
                      <p className="text-xs text-gray-600">
                        {med.dosage} {med.dosageUnit} • {med.frequency}
                      </p>
                      {med.prescribedBy && <p className="text-xs text-purple-600">By: {med.prescribedBy}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {med.reminderEnabled && (
                      <div className="flex items-center gap-1">
                        <Bell className="w-3 h-3 text-green-500" />
                        {(med.sentRemindersToday?.length || 0) > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                            {med.sentRemindersToday?.length || 0}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeMedicationGraph
