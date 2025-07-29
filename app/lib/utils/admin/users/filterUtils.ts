import { IUser } from '@/app/types'

export const userFilter = (users: IUser[], searchTerm: string, roleFilter: string, userTypeFilter: string) =>
  users.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase()

    const matchesType =
      userTypeFilter === 'all' ||
      (userTypeFilter === 'super' && user.isSuperUser) ||
      (userTypeFilter === 'admin' && user.isAdmin) ||
      (userTypeFilter === 'companion' && user.isCompanionUser) ||
      (userTypeFilter === 'comfort' && user.isComfortUser) ||
      (userTypeFilter === 'legacy' && user.isLegacyUser) ||
      (userTypeFilter === 'free' && user.isFreeUser)

    return matchesSearch && matchesRole && matchesType
  })
