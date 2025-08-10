import React, { FC } from 'react'
import { Users, Star, Shield } from 'lucide-react'
import AdminStatCard from '../common/AdminStatCard'
import { DashboardSummaryData } from '@/app/redux/features/adminSlice'

const UsersStats: FC<{ summary: DashboardSummaryData }> = ({ summary }) => {
  const usersStatsData = [
    {
      title: 'Free Users',
      value: summary.freeUsers,
      icon: Users,
      formatter: (value: { toLocaleString: () => any }) => value?.toLocaleString()
    },
    {
      title: 'Comofort Users',
      value: summary.comfortUsers,
      icon: Star,
      formatter: (value: { toLocaleString: () => any }) => value?.toLocaleString()
    },
    {
      title: 'Legacy Users',
      value: summary.legacyUsers,
      icon: Shield,
      formatter: (value: { toLocaleString: () => any }) => value?.toLocaleString()
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {usersStatsData.map((stat, i) => (
        <AdminStatCard key={i} title={stat.title} value={stat.formatter(stat.value ?? 0)} icon={stat.icon} index={i} />
      ))}
    </div>
  )
}

export default UsersStats
