import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/utils/api/optimisticUpdates'

const BASE_URL = '/appointment'

let appointmentHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getAppointmentHandlers = async () => {
  if (appointmentHandlers) {
    return appointmentHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addAppointmentToState, updateAppointmentInState, removeAppointmentFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/appointmentSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addAppointmentToState,
        updateAction: updateAppointmentInState,
        removeAction: removeAppointmentFromState,
        updateTokensAction: updateUserTokens,
        responseKey: 'appointment',
        getEntityFromState: (state: { appointment: { appointments: any[] } }, id: any) =>
          state.appointment.appointments.find((appointment) => appointment.id === id)
      }

      appointmentHandlers = createOptimisticHandlers(petConfig)
      return appointmentHandlers
    })()
  }

  return handlersPromise
}

export const appointmentApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createAppointment: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getAppointmentHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Appointment', 'Pet']
    }),
    updateAppointment: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.appointmentId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getAppointmentHandlers()
        const { appointmentId, ...updateFields } = data
        const updateData = { id: appointmentId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Appointment', 'Pet']
    }),
    deleteAppointment: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getAppointmentHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Appointment', 'Pet']
    })
  })
})

export const { useCreateAppointmentMutation, useUpdateAppointmentMutation, useDeleteAppointmentMutation } =
  appointmentApi
