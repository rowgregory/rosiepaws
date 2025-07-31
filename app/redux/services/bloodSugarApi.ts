import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { api } from './api'
import { updateUserTokens } from '../features/userSlice'

const BASE_URL = '/blood-sugar'

export const bloodSugarApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMyBloodSugars: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Blood-Sugar' as const, id })), { type: 'Blood-Sugar', id: 'LIST' }]
          : [{ type: 'Blood-Sugar', id: 'LIST' }]
    }),
    createBloodSugar: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Blood-Sugar', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateBloodSugar: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.bloodSugarId}/update`, method: 'PATCH', body }),
      invalidatesTags: ['Blood-Sugar', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteBloodSugar: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.bloodSugarId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Blood-Sugar', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const {
  useListMyBloodSugarsQuery,
  useCreateBloodSugarMutation,
  useUpdateBloodSugarMutation,
  useDeleteBloodSugarMutation
} = bloodSugarApi
