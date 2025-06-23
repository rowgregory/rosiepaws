import {
  authLoginLink,
  guardianDashboardLink,
  guardianPetsLink,
  guardianProfileLink,
  guardianSettingsLink,
  guardianSubscriptionLink
} from '@/public/data/admin.data'
import { LayoutDashboard, Cat, CreditCard, User, LogOut, Settings } from 'lucide-react'

export const guardianLinkData = (path: string) => [
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
