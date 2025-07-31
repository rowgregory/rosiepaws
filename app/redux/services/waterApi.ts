import { updateUserTokensOnSuccess } from '@/app/lib/utils/common/reduxUtils'
import { api } from './api'
import { updateUserTokens } from '../features/userSlice'

const BASE_URL = '/water'

export const waterApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listMyWaters: build.query({
      query: () => `${BASE_URL}/me`,
      providesTags: (result: { id: any }[]) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Water' as const, id })), { type: 'Water', id: 'LIST' }]
          : [{ type: 'Water', id: 'LIST' }]
    }),
    createWater: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Water', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    updateWater: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.waterId}/update`, method: 'PATCH', body }),
      invalidatesTags: ['Water', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    }),
    deleteWater: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.waterId}/delete`, method: 'DELETE', body }),
      invalidatesTags: ['Water', 'Pet'],
      onQueryStarted: updateUserTokensOnSuccess(updateUserTokens)
    })
  })
})

export const { useListMyWatersQuery, useCreateWaterMutation, useUpdateWaterMutation, useDeleteWaterMutation } = waterApi
