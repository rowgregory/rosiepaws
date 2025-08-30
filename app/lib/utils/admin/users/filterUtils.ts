import { IUser } from '@/app/types'

export const userFilter = (users: IUser[], searchTerm: string, roleFilter: string) =>
  users.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'comfort' && user.isComfortUser) ||
      (roleFilter === 'legacy' && user.isLegacyUser) ||
      (roleFilter === 'free' && user.isFreeUser)

    return matchesSearch && matchesRole
  })
