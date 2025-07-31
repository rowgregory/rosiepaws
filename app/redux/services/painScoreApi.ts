import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { api } from './api'
import { updateUserTokens } from '../features/userSlice'

const BASE_URL = '/pain-score'

export const painScoreApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMyPainScores: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Pain-Score' as const, id })), { type: 'Pain-Score', id: 'LIST' }]
          : [{ type: 'Pain-Score', id: 'LIST' }]
    }),
    createPainScore: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Pain-Score', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updatePainScore: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/${body.painScoreId}/update`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Pain-Score', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deletePainScore: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.painScoreId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Pain-Score', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const {
  useListMyPainScoresQuery,
  useCreatePainScoreMutation,
  useUpdatePainScoreMutation,
  useDeletePainScoreMutation
} = painScoreApi
