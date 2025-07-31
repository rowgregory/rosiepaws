import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { api } from './api'
import { updateUserTokens } from '../features/userSlice'

const BASE_URL = '/seizure'

export const seizureApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMySeizures: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Seizure' as const, id })), { type: 'Seizure', id: 'LIST' }]
          : [{ type: 'Seizure', id: 'LIST' }]
    }),
    createSeizure: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Seizure', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateSeizure: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.seizureId}/update`, method: 'PATCH', body }),
      invalidatesTags: ['Seizure', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteSeizure: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.seizureId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Seizure', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const { useListMySeizuresQuery, useCreateSeizureMutation, useUpdateSeizureMutation, useDeleteSeizureMutation } =
  seizureApi
