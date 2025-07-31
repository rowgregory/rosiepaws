import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { updateUserTokens } from '../features/userSlice'
import { api } from './api'

const BASE_URL = '/appointment'

export const appointmentApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createAppointment: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Pet', 'Appointment'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateAppointment: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.appointmentId}/update`, method: 'PATCH', body }),
      invalidatesTags: ['Pet', 'Appointment'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteAppointment: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.appointmentId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Pet', 'Appointment'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const { useCreateAppointmentMutation, useUpdateAppointmentMutation, useDeleteAppointmentMutation } =
  appointmentApi
