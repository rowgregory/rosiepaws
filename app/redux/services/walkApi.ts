import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { updateUserTokens } from '../features/userSlice'
import { api } from './api'

const BASE_URL = '/walk'

export const walkApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMyWalks: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Walk' as const, id })), { type: 'Walk', id: 'LIST' }]
          : [{ type: 'Walk', id: 'LIST' }]
    }),
    createWalk: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Walk', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateWalk: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.walkId}/update`, method: 'PATCH', body }),
      invalidatesTags: ['Walk', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteWalk: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.walkId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Walk', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const { useListMyWalksQuery, useCreateWalkMutation, useUpdateWalkMutation, useDeleteWalkMutation } = walkApi
