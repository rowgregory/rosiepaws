import { api } from './api'

const BASE_URL = '/gallery'

export const galleryItemApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    getAllGalleryItems: build.query({
      query: () => BASE_URL,
      providesTags: ['Gallery-Item']
    }),
    createGalleryItem: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      invalidatesTags: ['Gallery-Item']
    }),
    deleteGalleryItem: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.galleryId}`, method: 'DELETE', body }),
      invalidatesTags: ['Gallery-Item']
    })
  })
})

export const { useGetAllGalleryItemsQuery, useCreateGalleryItemMutation, useDeleteGalleryItemMutation } = galleryItemApi
