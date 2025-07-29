import RevenueGraph from './RevenueGraph'
import SubscriptionsGraph from './SubscriptionsGraph'
import UsersGraph from './UsersGraph'
import PetsGraph from './PetsGraph'
import FinancialGraph from './FinancialGraph'
import MonthlyRevenueGraph from './MonthlyRevenueGraph'
import UserGrowthGraph from './UserGrowthGraph'
import TokenUsageGraph from './TokenUsageGraph'
import SubscriptionStatusGraph from './SubscriptionStatusGraph'

export interface IGraphs {
  revenueByMonth: any[] | undefined
  planDistribution: any[] | undefined
  userGrowth: any[] | undefined
  userTypes: any[] | undefined
  petTypes: any[] | undefined
  topBreeds: any[] | undefined
  mrrByPlan: any[] | undefined
  paymentMethods: any[] | undefined
  tokenUsage: any[] | undefined
  statusDistribution: any[] | undefined
}

const renderGraphs = (selectedMetric: string, graphs: IGraphs) => {
  switch (selectedMetric) {
    case 'revenue':
      return <RevenueGraph data={graphs?.revenueByMonth} />

    case 'subscriptions':
      return <SubscriptionsGraph data={graphs} />

    case 'users':
      return <UsersGraph data={graphs} />

    case 'pets':
      return <PetsGraph data={graphs} />

    case 'financial':
      return <FinancialGraph data={graphs} />

    default:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyRevenueGraph data={graphs} />
          <UserGrowthGraph data={graphs} />
          <TokenUsageGraph data={graphs} />
          <SubscriptionStatusGraph data={graphs} />
        </div>
      )
  }
}

export default renderGraphs
