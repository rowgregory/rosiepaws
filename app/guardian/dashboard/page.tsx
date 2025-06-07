'use client'

import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Activity, Droplets, Utensils, Pill, CheckCircle, Clock, Zap, PawPrint } from 'lucide-react'
import Title from '@/app/components/admin/Title'
import Spinner from '@/app/components/common/Spinner'
import GuardianFeedingGraph from '@/app/components/guardian/GuardianFeedingGraph'
import GuardianPainScoreGraph from '@/app/components/guardian/GuardianPainScoreGraph'
import { RootState, useAppSelector } from '@/app/redux/store'
import GuardianMetricCard from '@/app/components/guardian/GuardianMetricCard'

const GuardianDashboard = () => {
  const { pet, loading } = useAppSelector((state: RootState) => state.pet)
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [expandedCards, setExpandedCards] = useState<string[]>(['overview'])

  // Process chart data
  const chartData = useMemo(() => {
    if (!pet) return {}

    return {
      painScores:
        pet?.painScores?.map((obj: any) => ({
          date: new Date(obj.createdAt).toLocaleDateString(),
          time: new Date(obj.createdAt).toLocaleTimeString(),
          score: obj.score,
          notes: obj.notes
        })) || [],

      bloodSugar:
        pet?.bloodSugars?.map((obj: any) => ({
          date: new Date(obj.timeTaken).toLocaleDateString(),
          time: new Date(obj.timeTaken).toLocaleTimeString(),
          value: parseInt(obj.value),
          status: obj.value < 80 ? 'low' : obj.value > 180 ? 'high' : obj.value > 120 ? 'elevated' : 'normal'
        })) || [],

      feedings:
        pet?.feedings?.map((obj: any) => ({
          date: new Date(obj.timeFed).toLocaleDateString(),
          time: new Date(obj.timeFed).toLocaleTimeString(),
          amount: obj.foodAmount,
          type: obj.foodType
        })) || [],

      waterIntake:
        pet?.waterIntakes?.map((obj: any) => ({
          date: new Date(obj.timeTaken).toLocaleDateString(),
          time: new Date(obj.timeTaken).toLocaleTimeString(),
          amount: obj.amount
        })) || [],

      medications:
        pet?.medications?.map((obj: any) => ({
          date: new Date(obj.timeTaken).toLocaleDateString(),
          time: new Date(obj.timeTaken).toLocaleTimeString(),
          name: obj.medicationName,
          dosage: obj.dosage,
          given: obj.given
        })) || [],

      seizures:
        pet?.seizures?.map((obj: any) => ({
          date: new Date(obj.timeTaken).toLocaleDateString(),
          time: new Date(obj.timeTaken).toLocaleTimeString(),
          duration: obj.duration,
          severity: obj.severity,
          triggers: obj.triggers
        })) || []
    }
  }, [pet])

  // Calculate quick stats
  const stats = useMemo(() => {
    if (!pet || !chartData) return {}

    const now = new Date()
    const today = now.toLocaleDateString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Filter data for today and this week
    const todayBloodSugar = chartData.bloodSugar?.filter((item) => item.date === today) || []
    const weekBloodSugar = chartData.bloodSugar?.filter((item) => new Date(item.date) >= weekAgo) || []

    const todayPain = chartData.painScores?.filter((item) => item.date === today) || []
    const weekPain = chartData.painScores?.filter((item) => new Date(item.date) >= weekAgo) || []

    const todayMedications = chartData.medications?.filter((item) => item.date === today) || []
    const todayWater = chartData.waterIntake?.filter((item) => item.date === today) || []
    const todayFeedings = chartData.feedings?.filter((item) => item.date === today) || []

    return {
      bloodSugar: {
        latest: todayBloodSugar[todayBloodSugar.length - 1]?.value || 0,
        average:
          weekBloodSugar.length > 0
            ? Math.round(weekBloodSugar.reduce((sum, item) => sum + item.value, 0) / weekBloodSugar.length)
            : 0,
        todayCount: todayBloodSugar.length,
        trend:
          todayBloodSugar.length >= 2
            ? todayBloodSugar[todayBloodSugar.length - 1].value > todayBloodSugar[todayBloodSugar.length - 2].value
              ? 'up'
              : 'down'
            : 'stable'
      },
      painScore: {
        latest: todayPain[0]?.score || 0,
        average:
          weekPain.length > 0 ? Math.round(weekPain.reduce((sum, item) => sum + item.score, 0) / weekPain.length) : 0,
        trend:
          weekPain.length >= 2 ? (weekPain[weekPain.length - 1].score > weekPain[0].score ? 'up' : 'down') : 'stable'
      },
      medications: {
        todayGiven: todayMedications.filter((med) => med.given).length,
        todayTotal: todayMedications.length,
        compliance:
          todayMedications.length > 0
            ? Math.round((todayMedications.filter((med) => med.given).length / todayMedications.length) * 100)
            : 100
      },
      water: {
        todayTotal: todayWater.reduce((sum, item) => sum + (item.amount || 0), 0),
        todayCount: todayWater.length
      },
      feedings: {
        todayCount: todayFeedings.length,
        lastMeal: todayFeedings[todayFeedings.length - 1]?.time || 'None today'
      },
      seizures: {
        thisWeek: chartData.seizures?.filter((item: any) => new Date(item.date) >= weekAgo).length || 0,
        lastSeizure: chartData.seizures?.[chartData.seizures.length - 1]?.date || 'None recorded'
      }
    }
  }, [pet, chartData])

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const renderChart = () => {
    switch (selectedMetric) {
      case 'blood-sugar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData.bloodSugar}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 300]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" label="Low" />
              <ReferenceLine y={120} stroke="#10b981" strokeDasharray="5 5" label="Normal" />
              <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="5 5" label="High" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'pain-score':
        return <GuardianPainScoreGraph chartData={chartData.painScores} />

      case 'feedings':
        return <GuardianFeedingGraph feedingData={chartData.feedings} />

      case 'water-intake':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.waterIntake}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="url(#waterGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )

      case 'medications':
        return (
          <div className="space-y-4">
            {chartData.medications?.map((med, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  med.given ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{med.name}</h4>
                    <p className="text-sm text-gray-600">
                      {med.dosage} • {med.time}
                    </p>
                  </div>
                  {med.given ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            )) || <p className="text-gray-500 text-center py-8">No medication data</p>}
          </div>
        )

      case 'seizures':
        return (
          <div className="space-y-4">
            {chartData.seizures?.map((seizure: any, index: number) => (
              <div key={index} className="p-4 rounded-xl border bg-orange-50 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Seizure Event</h4>
                    <p className="text-sm text-gray-600">
                      Duration: {seizure.duration}min • Severity: {seizure.severity}
                    </p>
                    <p className="text-xs text-gray-500">
                      {seizure.date} at {seizure.time}
                    </p>
                  </div>
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            )) || <p className="text-gray-500 text-center py-8">No seizure events recorded</p>}
          </div>
        )

      default:
        const foodTypeData =
          chartData?.feedings?.reduce((acc: any, feeding: any) => {
            const existing = acc.find((item: any) => item.type === feeding.type)
            if (existing) {
              existing.count += 1
              existing.amount += parseFloat(feeding.amount.replace('/', '.')) || 0
            } else {
              acc.push({
                type: feeding.type,
                count: 1,
                amount: parseFloat(feeding.amount.replace('/', '.')) || 0
              })
            }
            return acc
          }, []) || []
        const COLORS: any = {
          wet: '#3b82f6',
          dry: '#f59e0b',
          wet_dry: '#10b981'
        }
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Recent Blood Sugar</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData.bloodSugar?.slice(-7)}>
                  <Line dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Pain Trends</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData.painScores?.slice(-7)}>
                  <Area dataKey="score" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.3)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Food Type Distribution</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={foodTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {foodTypeData.map((entry: any, index: any) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.type]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} feedings`, 'Count']}
                      labelFormatter={(label) => `${label.charAt(0).toUpperCase() + label.slice(1)} Food`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {foodTypeData.map((item: any) => (
                  <div key={item.type} className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.type] }}></div>
                    <span className="capitalize">{item.type.replace('_', ' + ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center pt-12">
        <Spinner fill="fill-indigo-500" track="text-white" wAndH="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-6">
      <div className="max-w-full mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <div>
              <Title title={`${pet?.name}'s Health Dashboard`} />
              <p className="text-gray-600 mt-1">
                {pet?.breed} • Last updated {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <GuardianMetricCard
            id="blood-sugar"
            title="Blood Sugar"
            value={stats.bloodSugar?.latest ? `${stats.bloodSugar.latest} mg/dL` : 'No data'}
            subtitle={`Avg: ${stats.bloodSugar?.average || 0} mg/dL • ${
              stats.bloodSugar?.todayCount || 0
            } readings today`}
            icon={Droplets}
            color="red"
            trend={stats.bloodSugar?.trend}
            onClick={() => setSelectedMetric('blood-sugar')}
            isActive={selectedMetric === 'blood-sugar'}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="pain-score"
            title="Pain Level"
            value={`${stats.painScore?.latest ?? 'No data'}/10`}
            subtitle={`Weekly avg: ${stats.painScore?.average || 0}/10`}
            icon={Activity}
            color="orange"
            trend={stats.painScore?.trend}
            onClick={() => setSelectedMetric('pain-score')}
            isActive={selectedMetric === 'pain-score'}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="feedings"
            title="Feedings"
            value={stats.feedings?.todayCount || 0}
            subtitle={`Last meal: ${stats.feedings?.lastMeal || 'None today'}`}
            icon={Utensils}
            color="green"
            onClick={() => setSelectedMetric('feedings')}
            isActive={selectedMetric === 'feedings'}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="water-intake"
            title="Water Intake"
            value={`${stats.water?.todayTotal || 0}ml`}
            subtitle={`${stats.water?.todayCount || 0} drinks today`}
            icon={Droplets}
            color="blue"
            onClick={() => setSelectedMetric('water-intake')}
            isActive={selectedMetric === 'water-intake'}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="medications"
            title="Medications"
            value={`${stats.medications?.todayGiven || 0}/${stats.medications?.todayTotal || 0}`}
            subtitle={`${stats.medications?.compliance || 100}% compliance`}
            icon={Pill}
            color="purple"
            onClick={() => setSelectedMetric('medications')}
            isActive={selectedMetric === 'medications'}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="seizures"
            title="Seizures"
            value={stats.seizures?.thisWeek || 0}
            subtitle={`This week • Last: ${stats.seizures?.lastSeizure || 'None'}`}
            icon={Zap}
            color="yellow"
            onClick={() => setSelectedMetric('seizures')}
            isActive={selectedMetric === 'seizures'}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedMetric === 'blood-sugar'
                  ? 'Blood Sugar Monitoring'
                  : selectedMetric === 'pain-score'
                  ? 'Pain Score Tracking'
                  : selectedMetric === 'feedings'
                  ? 'Feeding History'
                  : selectedMetric === 'water-intake'
                  ? 'Water Intake Logs'
                  : selectedMetric === 'medications'
                  ? 'Medication Schedule'
                  : selectedMetric === 'seizures'
                  ? 'Seizure Events'
                  : 'Health Overview'}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedMetric === 'overview'
                  ? 'Quick overview of all health metrics'
                  : `Detailed ${selectedMetric.replace('-', ' ')} data and trends`}
              </p>
            </div>
            <button
              onClick={() => setSelectedMetric('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMetric === 'overview'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
          </div>

          {renderChart()}
        </div>
      </div>
    </div>
  )
}

export default GuardianDashboard
