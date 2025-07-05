import {
  authLoginLink,
  blogLink,
  dashboardLink,
  guardianDashboardLink,
  guardianHomeLink,
  guardianPetsLink,
  guardianProfileLink,
  guardianSettingsLink,
  guardianSubscriptionLink,
  petsLink,
  settingsLink,
  subscriptionsLink
} from '@/public/data/admin.data'
import { LayoutDashboard, Cat, CreditCard, User, LogOut, Settings, Dog, Pen, Home } from 'lucide-react'

export const guardianLinkData = (path: string) => [
  {
    icon: Home,
    textKey: 'Home',
    linkKey: guardianHomeLink,
    isActive: path === guardianHomeLink
  },
  {
    icon: LayoutDashboard,
    textKey: 'Dashboard',
    linkKey: guardianDashboardLink,
    isActive: path === guardianDashboardLink
  },
  {
    icon: Cat,
    textKey: 'Pets',
    linkKey: guardianPetsLink,
    isActive: path === guardianPetsLink
  },
  {
    icon: CreditCard,
    textKey: 'Subscription',
    linkKey: guardianSubscriptionLink,
    isActive: path === guardianSubscriptionLink
  },
  {
    icon: User,
    textKey: 'Profile',
    linkKey: guardianProfileLink,
    isActive: path === guardianProfileLink
  },
  {
    icon: Settings,
    textKey: 'Settings',
    linkKey: guardianSettingsLink,
    isActive: path === guardianSettingsLink
  },
  {
    icon: LogOut,
    textKey: 'Logout',
    linkKey: authLoginLink,
    isActive: path === authLoginLink
  }
]

export const adminLinkData = (path: string) => [
  {
    icon: LayoutDashboard,
    textKey: 'Dashboard',
    linkKey: dashboardLink,
    isActive: path === dashboardLink
  },
  {
    icon: CreditCard,
    textKey: 'Subscriptions',
    linkKey: subscriptionsLink,
    isActive: path === subscriptionsLink
  },
  {
    icon: Dog,
    textKey: 'Pets',
    linkKey: petsLink,
    isActive: path === petsLink
  },
  {
    icon: Pen,
    textKey: 'Blog',
    linkKey: blogLink,
    isActive: path === blogLink
  },
  {
    icon: Settings,
    textKey: 'Settings',
    linkKey: settingsLink,
    isActive: path === settingsLink
  },
  {
    icon: LogOut,
    textKey: 'Logout',
    linkKey: authLoginLink,
    isActive: path === authLoginLink
  }
]
