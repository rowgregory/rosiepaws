'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, CreditCard, PawPrint, Coins, Activity } from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'
import AdminStatCard from '@/app/components/admin/common/AdminStatCard'
import renderGraphs from '@/app/components/admin/graphs/renderGraphs'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'
import { ADMIN_DASHBOARD_ANALYTICS_TABS } from '@/app/lib/constants'

const AdminDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const { summary, charts } = useAppSelector((state: RootState) => state.admin)

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <AdminPageHeader title="Rosie Paws Hub" subtitle="Key performance indicators and business metrics overview" />
      <div>
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminStatCard
              title="Total Users"
              value={summary?.totalUsers?.toLocaleString() || '0'}
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
              index={1}
            />
            <AdminStatCard
              title="Total Pets"
              value={summary?.totalPets?.toLocaleString() || '0'}
              icon={PawPrint}
              subtitle={`${summary?.petsPerUser || '0'} average per user`}
              trend={{ value: 8.3, isPositive: true }}
              index={2}
            />
            <AdminStatCard
              title="Active Subscriptions"
              value={summary?.activeSubscriptions?.toLocaleString() || '0'}
              icon={CreditCard}
              subtitle={`${summary?.totalSubscriptions || '0'} total subscriptions`}
              trend={{ value: 15.7, isPositive: true }}
              index={3}
            />
            <AdminStatCard
              title="Total Revenue"
              value={`$${summary?.totalRevenue?.toLocaleString() || '0'}`}
              icon={DollarSign}
              subtitle={`$${summary?.averageRevenuePerUser || '0'} ARPU`}
              trend={{ value: 22.1, isPositive: true }}
              index={4}
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
            {ADMIN_DASHBOARD_ANALYTICS_TABS.map((metric) => (
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
            {renderGraphs(selectedMetric, charts)}
          </motion.div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
