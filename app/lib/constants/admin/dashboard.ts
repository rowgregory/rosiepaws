import { BarChart3, CreditCard, DollarSign, PawPrint, TrendingUp, Users } from 'lucide-react'

export const ADMIN_DASHBOARD_ANALYTICS_TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'financial', label: 'Financial', icon: TrendingUp }
]
