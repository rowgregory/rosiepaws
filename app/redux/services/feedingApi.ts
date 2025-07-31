import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { api } from './api'
import { updateUserTokens } from '../features/userSlice'

const BASE_URL = '/feeding'

export const feedingApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMyFeedings: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Feeding' as const, id })), { type: 'Feeding', id: 'LIST' }]
          : [{ type: 'Feeding', id: 'LIST' }]
    }),
    createFeeding: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Feeding', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateFeeding: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/${body.feedingId}/update`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Feeding', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteFeeding: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.feedingId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Feeding', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const { useListMyFeedingsQuery, useCreateFeedingMutation, useUpdateFeedingMutation, useDeleteFeedingMutation } =
  feedingApi
