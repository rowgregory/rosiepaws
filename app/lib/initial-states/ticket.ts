import { ITicket } from '@/app/types'

export interface TicketPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TicketsStatePayload {
  tickets: ITicket[]
  ticket: ITicket | null
  loading: boolean
  error: string | null
  pagination: TicketPagination
}

export const ticketsInitialState: TicketsStatePayload = {
  tickets: [] as ITicket[],
  ticket: null as ITicket | null,
  loading: false,
  error: null as string | null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
}
