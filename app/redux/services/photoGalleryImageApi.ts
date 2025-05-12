import { api } from './api'
import {
  addPhotoGalleryImageToState,
  removePhotoGalleryImageFromState,
  updatePhotoGalleryImageInState
} from '../features/photoGalleryImageSlice'

const BASE_URL = '/photo-gallery-image'

export const photoGalleryImageApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchPhotoGalleryImages: build.query({
      query: () => `${BASE_URL}/fetch-photo-gallery-images`
    }),
    createPhotoGalleryImage: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-photo-gallery-image`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(addPhotoGalleryImageToState(data.photoGalleryImage))
      }
    }),
    updatePhotoGalleryImage: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/update-photo-gallery-image`, method: 'PUT', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(updatePhotoGalleryImageInState(data.photoGalleryImage))
      }
    }),
    deletePhotoGalleryImage: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/delete-photo-gallery-image`, method: 'DELETE', body }),
      onQueryStarted: async (arg: any, { dispatch, queryFulfilled }: any) => {
        await queryFulfilled

        dispatch(removePhotoGalleryImageFromState(arg.id))
      }
    })
  })
})

export const {
  useFetchPhotoGalleryImagesQuery,
  useCreatePhotoGalleryImageMutation,
  useDeletePhotoGalleryImageMutation,
  useUpdatePhotoGalleryImageMutation
} = photoGalleryImageApi
