'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, DollarSign, Users, CreditCard, BarChart3, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import GuardianMetricCard from '@/app/components/guardian/GuardianMetricCard'

// Sample data
const monthlyVolumeData = [
  { month: 'Jan', volume: 125000, subscriptions: 450 },
  { month: 'Feb', volume: 138000, subscriptions: 520 },
  { month: 'Mar', volume: 152000, subscriptions: 610 },
  { month: 'Apr', volume: 145000, subscriptions: 580 },
  { month: 'May', volume: 168000, subscriptions: 650 },
  { month: 'Jun', volume: 185000, subscriptions: 720 },
  { month: 'Jul', volume: 192000, subscriptions: 780 },
  { month: 'Aug', volume: 210000, subscriptions: 850 },
  { month: 'Sep', volume: 198000, subscriptions: 820 },
  { month: 'Oct', volume: 225000, subscriptions: 920 },
  { month: 'Nov', volume: 240000, subscriptions: 980 },
  { month: 'Dec', volume: 265000, subscriptions: 1050 }
]

const subscriptionBreakdown = [
  { plan: 'Basic', count: 450, revenue: 22500, color: 'blue' },
  { plan: 'Pro', count: 320, revenue: 64000, color: 'green' },
  { plan: 'Premium', count: 100, revenue: 70000, color: 'yellow' }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.name === 'Volume' ? '$' : ''}${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const AdminDashboard = () => {
  const [expandedCards, setExpandedCards] = useState([])
  const [selectedMetric, setSelectedMetric] = useState('overview')

  const toggleCard = (id: any) => {
    setExpandedCards((prev: any) => (prev.includes(id) ? prev.filter((cardId: any) => cardId !== id) : [...prev, id]))
  }

  const totalVolume = monthlyVolumeData.reduce((sum, item) => sum + item.volume, 0)
  const totalSubscriptions = monthlyVolumeData[monthlyVolumeData.length - 1].subscriptions
  const avgMonthlyVolume = Math.round(totalVolume / monthlyVolumeData.length)
  const volumeGrowth = (
    ((monthlyVolumeData[monthlyVolumeData.length - 1].volume - monthlyVolumeData[0].volume) /
      monthlyVolumeData[0].volume) *
    100
  ).toFixed(1)

  // Chart rendering function
  const renderChart = () => {
    switch (selectedMetric) {
      case 'revenue':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    name="Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      case 'subscriptions':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="subscriptions" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Subscriptions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      case 'conversion':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { stage: 'Visitors', count: 10000, color: '#EF4444' },
                    { stage: 'Signups', count: 3200, color: '#F59E0B' },
                    { stage: 'Trials', count: 1800, color: '#10B981' },
                    { stage: 'Paid', count: 580, color: '#8B5CF6' }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="stage" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      case 'churn':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Jan', churn: 3.2, retention: 96.8 },
                    { month: 'Feb', churn: 2.8, retention: 97.2 },
                    { month: 'Mar', churn: 3.5, retention: 96.5 },
                    { month: 'Apr', churn: 2.9, retention: 97.1 },
                    { month: 'May', churn: 2.1, retention: 97.9 },
                    { month: 'Jun', churn: 2.4, retention: 97.6 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="churn" stroke="#EF4444" strokeWidth={3} name="Churn Rate %" />
                  <Line type="monotone" dataKey="retention" stroke="#10B981" strokeWidth={3} name="Retention Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Volume</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyVolumeData.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                      name="Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyVolumeData.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="subscriptions" fill="#10B981" radius={[4, 4, 0, 0]} name="Subscriptions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="plan" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="plan" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-full mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor your gross volume and subscription metrics</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <GuardianMetricCard
            id="total-volume"
            title="Total Gross Volume"
            value={`${totalVolume.toLocaleString()}`}
            subtitle="Last 12 months"
            icon={DollarSign}
            color="green"
            trend="up"
            trendValue={`+${volumeGrowth}%`}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="avg-monthly"
            title="Avg Monthly Volume"
            value={`${avgMonthlyVolume.toLocaleString()}`}
            subtitle="Rolling average"
            icon={BarChart3}
            color="blue"
            trend="up"
            trendValue="+12.5%"
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="active-subs"
            title="Active Subscriptions"
            value={totalSubscriptions.toLocaleString()}
            subtitle="Current month"
            icon={Users}
            color="purple"
            trend="up"
            trendValue="+8.2%"
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="conversion"
            title="Conversion Rate"
            value="3.2%"
            subtitle="This month"
            icon={TrendingUp}
            color="yellow"
            trend="up"
            trendValue="+0.3%"
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="monthly-recurring"
            title="Monthly Recurring Revenue"
            value="$264,500"
            subtitle="Current MRR"
            icon={CreditCard}
            color="red"
            trend="up"
            trendValue="+15.3%"
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />

          <GuardianMetricCard
            id="churn-rate"
            title="Churn Rate"
            value="2.1%"
            subtitle="Monthly churn"
            icon={TrendingDown}
            color="blue"
            trend="down"
            trendValue="-0.5%"
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />
        </div>

        {/* Chart Selection Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'revenue', label: 'Revenue', icon: DollarSign },
              { id: 'subscriptions', label: 'Subscriptions', icon: Users },
              { id: 'conversion', label: 'Conversion', icon: TrendingUp },
              { id: 'churn', label: 'Churn Analysis', icon: TrendingDown }
            ].map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedMetric === metric.id
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:shadow-md'
                }`}
              >
                <metric.icon className="w-4 h-4" />
                <span>{metric.label}</span>
              </button>
            ))}
          </div>

          <motion.div
            key={selectedMetric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderChart()}
          </motion.div>
        </div>

        {/* Original Charts Section - Now Hidden */}
        <div className="hidden grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Volume Chart */}
          <GuardianMetricCard
            id="volume-chart"
            title="Monthly Gross Volume Trend"
            value=""
            subtitle="Click to expand detailed view"
            icon={Calendar}
            color="blue"
            collapsible={true}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    name="Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GuardianMetricCard>

          {/* Subscription Growth Chart */}
          <GuardianMetricCard
            id="subscription-chart"
            title="Subscription Growth"
            value=""
            subtitle="Monthly subscription acquisitions"
            icon={CreditCard}
            color="green"
            collapsible={true}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="subscriptions" fill="#10B981" radius={[4, 4, 0, 0]} name="Subscriptions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GuardianMetricCard>
        </div>

        {/* Subscription Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionBreakdown.map((plan) => (
            <GuardianMetricCard
              key={plan.plan}
              id={`plan-${plan.plan}`}
              title={`${plan.plan} Plan`}
              value={plan.count.toLocaleString()}
              subtitle={`$${plan.revenue.toLocaleString()} revenue`}
              icon={CreditCard}
              color={plan.color}
              trend="up"
              trendValue="+5.2%"
              expandedCards={expandedCards}
              toggleCard={toggleCard}
              collapsible={true}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="font-semibold">${plan.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. per User</span>
                  <span className="font-semibold">${Math.round(plan.revenue / plan.count).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      plan.color === 'blue'
                        ? 'from-blue-500 to-cyan-500'
                        : plan.color === 'green'
                          ? 'from-green-500 to-emerald-500'
                          : plan.color === 'purple'
                            ? 'from-indigo-500 to-purple-500'
                            : 'from-yellow-500 to-orange-500'
                    }`}
                    style={{ width: `${(plan.count / 1050) * 100}%` }}
                  ></div>
                </div>
              </div>
            </GuardianMetricCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
