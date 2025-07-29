import { ITicket } from '@/app/types'

export const getTicketStats = (tickets: ITicket[]) => {
  const total = tickets.length
  const open = tickets.filter((t) => t.status === 'open').length
  const inProgress = tickets.filter((t) => t.status === 'in_progress').length
  const resolved = tickets.filter((t) => t.status === 'resolved').length
  const closed = tickets.filter((t) => t.status === 'closed').length

  return { total, open, inProgress, resolved, closed }
}

export const getUniqueTicketCategories = (tickets: ITicket[]) => {
  return [...new Set(tickets.map((t) => t.category))]
}
