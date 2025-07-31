import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { api } from './api'
import { updateUserTokens } from '../features/userSlice'

const BASE_URL = '/movement'

export const movementApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMyMovements: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Movement' as const, id })), { type: 'Movement', id: 'LIST' }]
          : [{ type: 'Movement', id: 'LIST' }]
    }),
    createMovement: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Movement', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateMovement: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.movementId}/update`, method: 'PATCH', body }),
      invalidatesTags: ['Movement', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteMovement: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.movementId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Movement', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const {
  useListMyMovementsQuery,
  useCreateMovementMutation,
  useUpdateMovementMutation,
  useDeleteMovementMutation
} = movementApi
