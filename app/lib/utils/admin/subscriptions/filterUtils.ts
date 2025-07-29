import { IStripeSubscription } from '@/app/types'

export const subscriptionFilter = (
  subscriptions: IStripeSubscription[],
  searchTerm: string,
  statusFilter: string,
  planFilter: string
) =>
  subscriptions?.filter((subscription) => {
    const matchesSearch =
      subscription.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter
    const matchesPlan = planFilter === 'all' || subscription.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  }) || []
