import { api } from './api'

const BASE_URL = '/media'

export const mediaApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    getAllMedia: build.query({
      query: () => BASE_URL,
      providesTags: ['Media']
    }),
    createMedia: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Media']
    }),
    deleteMedia: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.mediaId}`, method: 'DELETE', body }),
      invalidatesTags: ['Media']
    }),
    updateAnalytics: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.mediaId}/analytics`, method: 'PUT', body }),
      invalidatesTags: ['Media']
    })
  })
})

export const { useGetAllMediaQuery, useCreateMediaMutation, useDeleteMediaMutation, useUpdateAnalyticsMutation } =
  mediaApi
