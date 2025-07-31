import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { api } from './api'
import { updateUserTokens } from '../features/userSlice'

const BASE_URL = '/medication'

export const medicationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMyMedications: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Medication' as const, id })), { type: 'Medication', id: 'LIST' }]
          : [{ type: 'Medication', id: 'LIST' }]
    }),
    createMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Medication', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.medicationId}/update`, method: 'PATCH', body }),
      invalidatesTags: ['Medication', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.medicationId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Medication', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const {
  useListMyMedicationsQuery,
  useCreateMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation
} = medicationApi
