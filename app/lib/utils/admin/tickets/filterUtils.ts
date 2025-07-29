import { ITicket } from '@/app/types'

export const ticketFilter = (
  tickets: ITicket[],
  searchTerm: string,
  statusFilter: string,
  categoryFilter: string,
  priorityFilter: string
) =>
  tickets.filter((ticket: ITicket) => {
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })
