// lib/admin/logs/filterUtils.ts
import { ILog } from '@/app/types'

export const logFilter = (logs: ILog[], searchTerm: string, levelFilter: string, dateFilter: string) =>
  logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.metadata || {})
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesLevel = levelFilter === 'all' || log.level.toLowerCase() === levelFilter.toLowerCase()

    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'today' && new Date(log.createdAt).toDateString() === new Date().toDateString())

    return matchesSearch && matchesLevel && matchesDate
  })
