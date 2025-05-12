import { updateTextBlockInState } from '../features/textBlockSlice'
import { api } from './api'

const BASE_URL = '/text-block'

export const textBlockApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    updateTextBlock: build.mutation({
      query: (body: { key: string; value: string }) => ({
        url: `${BASE_URL}/update-text-block`,
        method: 'PUT',
        body
      }),
      onQueryStarted: async (_arg: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(updateTextBlockInState({ key: data?.key, value: data?.value, type: data?.type }))
      }
    }),
    textBlockSystemStatus: build.query({
      query: () => `${BASE_URL}/system-status`,
      providesTags: ['Text-Block'],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: true
    }),
    fetchTextBlocks: build.query({
      query: () => `${BASE_URL}/fetch-text-blocks`,
      providesTags: ['Text-Block'],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: true
    })
  })
})

export const { useUpdateTextBlockMutation, useTextBlockSystemStatusQuery, useFetchTextBlocksQuery } = textBlockApi
