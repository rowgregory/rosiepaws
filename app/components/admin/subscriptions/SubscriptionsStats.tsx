import { IStripeSubscription } from '@/app/types'
import { FC } from 'react'
import { Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import AdminStatCard from '../common/AdminStatCard'
import { formatPrice } from '@/app/lib/utils/common/currencyUtils'

const SubscriptionsStats: FC<{ subscriptions: IStripeSubscription[] }> = ({ subscriptions }) => {
  const totalSubscriptions = subscriptions?.length || 0
  const activeSubscriptions = subscriptions?.filter((s) => s.status === 'active').length || 0
  const totalMRR =
    subscriptions?.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.planPrice, 0) / 100 || 0
  const avgRevenuePerUser = activeSubscriptions > 0 ? totalMRR / activeSubscriptions : 0

  const subscriptionStatsData = [
    {
      title: 'Total Subscriptions',
      value: totalSubscriptions,
      icon: Users,
      formatter: (value: { toLocaleString: () => any }) => value.toLocaleString()
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: CheckCircle,
      formatter: (value: { toLocaleString: () => any }) => value.toLocaleString()
    },
    {
      title: 'Monthly Recurring Revenue',
      value: totalMRR,
      icon: DollarSign,
      formatter: (value: number) => formatPrice(value)
    },
    {
      title: 'Average Revenue Per User',
      value: avgRevenuePerUser,
      icon: TrendingUp,
      formatter: (value: number) => formatPrice(value)
    }
  ]

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {subscriptionStatsData.map((stat, i) => (
        <AdminStatCard key={i} title={stat.title} value={stat.formatter(stat.value)} icon={stat.icon} index={i} />
      ))}
    </div>
  )
}

export default SubscriptionsStats
