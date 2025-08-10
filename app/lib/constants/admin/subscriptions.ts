export const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'incomplete', label: 'Incomplete' }
]

export const SUBSCRIPTION_PLAN_OPTIONS = [
  { value: 'all', label: 'All Plans', color: 'gray' },
  { value: 'FREE', label: 'Free', color: 'gray' },
  { value: 'COMFORT', label: 'Comfort', color: 'green' },
  { value: 'LEGACY', label: 'Legacy', color: 'yellow' }
]

export const SUBSCRIPTION_COLUMNS = [
  { key: 'customer', label: 'Customer' },
  { key: 'plan', label: 'Plan' },
  { key: 'status', label: 'Status' },
  { key: 'payment', label: 'Payment Method' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'billing', label: 'Next Billing' },
  { key: 'created', label: 'Created' },
  { key: 'actions', label: 'Actions', align: 'center' }
]
