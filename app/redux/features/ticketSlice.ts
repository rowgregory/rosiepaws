import { Reducer, createSlice } from '@reduxjs/toolkit'
import { ticketsInitialState, TicketsStatePayload } from '@/app/lib/initial-states/ticket'
import { ticketApi } from '../services/ticketApi'

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState: ticketsInitialState,
  reducers: {
    addMessageToTicket: (state: any, { payload }: any) => {
      if (state.ticket && state.ticket.messages) {
        state.ticket.messages.push(payload)
        state.ticket.updatedAt = new Date().toISOString()
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(ticketApi.endpoints.createTicket.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(ticketApi.endpoints.createTicketMessage.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(ticketApi.endpoints.updateTicketStatus.matchFulfilled, (state, { payload }: any) => {
        state.ticket = payload.ticket
      })
      .addMatcher(ticketApi.endpoints.fetchTicketById.matchFulfilled, (state, { payload }: any) => {
        state.loading = false
        state.ticket = payload.ticket
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'ticketApi',
        (state, { payload }: any) => {
          state.loading = false
          state.error = payload.data?.message
        }
      )
  }
})

export const ticketReducer = ticketSlice.reducer as Reducer<TicketsStatePayload>

export const { addMessageToTicket } = ticketSlice.actions
