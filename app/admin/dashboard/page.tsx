'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, CreditCard, BarChart3, PawPrint, Coins, Activity, Download } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { RootState, useAppSelector } from '@/app/redux/store'
import StatCard from '@/app/components/admin/StatCard'
import CustomTooltip from '@/app/components/admin/CustomToolTip'
import { COLORS } from '@/app/lib/constants'

const AdminDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const { summary, charts } = useAppSelector((state: RootState) => state.admin)

  // Chart rendering function
  const renderChart = () => {
    switch (selectedMetric) {
      case 'revenue':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analysis</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Current fiscal year
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1f2937"
                    strokeWidth={2}
                    dot={{ fill: '#1f2937', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#1f2937', strokeWidth: 2 }}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      case 'subscriptions':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscription Growth</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="subscriptions" fill="#374151" radius={[2, 2, 0, 0]} name="Subscriptions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.planDistribution}
                      dataKey="count"
                      nameKey="plan"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ plan, percentage }) => `${plan}: ${percentage}%`}
                    >
                      {charts.planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="totalUsers"
                      stroke="#1f2937"
                      strokeWidth={2}
                      dot={{ fill: '#1f2937', strokeWidth: 2, r: 4 }}
                      name="Total Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#6b7280"
                      strokeWidth={2}
                      dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
                      name="New Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">User Types</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.userTypes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="type"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#374151" radius={[2, 2, 0, 0]} name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      case 'pets':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Pet Types</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.petTypes}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                    >
                      {charts.petTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Breeds</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.topBreeds} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <YAxis
                      type="number"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      allowDecimals={false}
                    />
                    <XAxis
                      dataKey="breed"
                      type="category"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="url(#breedGradient)" radius={[0, 0, 0, 0]} name="Count" />
                    <defs>
                      <linearGradient id="breedGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#6b7280" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      case 'financial':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">MRR by Plan</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.mrrByPlan}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="plan" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="mrr" fill="#374151" radius={[2, 2, 0, 0]} name="MRR ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.paymentMethods}
                      dataKey="count"
                      nameKey="method"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ method, percentage }) => `${method}: ${percentage}%`}
                    >
                      {charts.paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.revenueByMonth.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1f2937"
                      strokeWidth={2}
                      dot={{ fill: '#1f2937', strokeWidth: 2, r: 3 }}
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.userGrowth.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="newUsers" fill="#374151" radius={[2, 2, 0, 0]} name="New Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Token Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.tokenUsage}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value, outerRadius, midAngle, cx, cy }) => {
                        const RADIAN = Math.PI / 180
                        const radius = outerRadius + 22 // Distance outside the slice
                        const xPos = cx + radius * Math.cos(-midAngle * RADIAN)
                        const yPos = cy + radius * Math.sin(-midAngle * RADIAN)

                        return (
                          <text
                            x={xPos}
                            y={yPos}
                            fill="#000"
                            textAnchor={xPos > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            fontSize={12} // Make text smaller
                          >
                            {`${name}: ${value.toLocaleString()}`}
                          </text>
                        )
                      }}
                    >
                      {charts.tokenUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscription Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.statusDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#374151" radius={[2, 2, 0, 0]} name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Professional Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rosie Paws Hub</h1>
          <p className="text-gray-600">Key performance indicators and business metrics overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div>
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={summary?.totalUsers?.toLocaleString() || '0'}
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Total Pets"
              value={summary?.totalPets?.toLocaleString() || '0'}
              icon={PawPrint}
              subtitle={`${summary?.petsPerUser || '0'} average per user`}
              trend={{ value: 8.3, isPositive: true }}
            />
            <StatCard
              title="Active Subscriptions"
              value={summary?.activeSubscriptions?.toLocaleString() || '0'}
              icon={CreditCard}
              subtitle={`${summary?.totalSubscriptions || '0'} total subscriptions`}
              trend={{ value: 15.7, isPositive: true }}
            />
            <StatCard
              title="Total Revenue"
              value={`$${summary?.totalRevenue?.toLocaleString() || '0'}`}
              icon={DollarSign}
              subtitle={`$${summary?.averageRevenuePerUser || '0'} ARPU`}
              trend={{ value: 22.1, isPositive: true }}
            />
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Coins className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Token Utilization</h3>
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-gray-900">{summary?.tokenUtilizationRate || '0'}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-700 rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${summary?.tokenUtilizationRate || 0}%` }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">+5.2%</span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Average Revenue Per User</h3>
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-gray-900">${summary?.averageRevenuePerUser || '0'}</p>
                <p className="text-sm text-gray-500">Monthly recurring revenue per user</p>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">+18.3%</span>
                  <span className="text-xs text-gray-500">vs last quarter</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics</h2>
            <p className="text-gray-600">Comprehensive data analysis and performance trends</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'revenue', label: 'Revenue', icon: DollarSign },
              { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'pets', label: 'Pets', icon: PawPrint },
              { id: 'financial', label: 'Financial', icon: TrendingUp }
            ].map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  selectedMetric === metric.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
