import {
  authLoginLink,
  dashboardLink,
  petsLink,
  settingsLink,
  subscriptionsLink,
  logsLink,
  usersLink,
  ticketsLink,
  mediaLibraryLink,
  changelogLink
} from '@/public/data/admin.data'
import {
  LayoutDashboard,
  CreditCard,
  LogOut,
  Settings,
  Dog,
  Logs,
  Users,
  Tickets,
  Library,
  GitBranch
} from 'lucide-react'

export const adminNavigationLinks = (path: string, isSuperUser: boolean) => [
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
    icon: Library,
    textKey: 'Media Library',
    linkKey: mediaLibraryLink,
    isActive: path === mediaLibraryLink
  },
  {
    icon: Users,
    textKey: 'Users',
    linkKey: usersLink,
    isActive: path === usersLink
  },
  {
    icon: Settings,
    textKey: 'Settings',
    linkKey: settingsLink,
    isActive: path === settingsLink
  },
  {
    icon: GitBranch,
    textKey: 'Changelog',
    linkKey: changelogLink,
    isActive: path === changelogLink
  },
  ...(isSuperUser
    ? [
        {
          icon: Tickets,
          textKey: 'Tickets',
          linkKey: ticketsLink,
          isActive: path === ticketsLink
        },
        {
          icon: Logs,
          textKey: 'Logs',
          linkKey: logsLink,
          isActive: path === logsLink
        }
      ]
    : []),
  {
    icon: LogOut,
    textKey: 'Logout',
    linkKey: authLoginLink,
    isActive: path === authLoginLink
  }
]
