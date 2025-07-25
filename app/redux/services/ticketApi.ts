import { addMessageToTicket } from '../features/ticketSlice'
import { api } from './api'

const BASE_URL = '/ticket'

export const ticketApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createTicket: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/create-ticket`,
        method: 'POST',
        body
      })
    }),
    createTicketMessage: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/${body.ticketId}/messages`,
        method: 'POST',
        body
      }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newMessage = data.message
        dispatch(addMessageToTicket(newMessage))
      }
    }),
    updateTicketStatus: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/${body.ticketId}/status`,
        method: 'PATCH',
        body
      })
    }),
    fetchTicketById: build.query({
      query: (ticketId) => `${BASE_URL}/${ticketId}`
    })
  })
})

export const {
  useCreateTicketMutation,
  useCreateTicketMessageMutation,
  useUpdateTicketStatusMutation,
  useFetchTicketByIdQuery
} = ticketApi
