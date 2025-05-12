import { Reducer, createSlice } from '@reduxjs/toolkit'
import { photoGalleryImageApi } from '../services/photoGalleryImageApi'

export interface PhotoGalleryImageProps {
  id: string
  imageUrl: string
  imageFilename: string
  isHomeHero: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PhotoGalleryImageStatePayload {
  loading: boolean
  error: any
  success: boolean
  photoGalleryImages: PhotoGalleryImageProps[]
  photoGalleryImage: PhotoGalleryImageProps
  photoGalleryImagesCount: number
  noPhotoGalleryImages: boolean
}

const photoGalleryImageState: PhotoGalleryImageProps = {
  id: '',
  imageUrl: '',
  imageFilename: '',
  isHomeHero: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

const initialPhotoGalleryImageState: PhotoGalleryImageStatePayload = {
  loading: true,
  error: null,
  success: false,
  photoGalleryImages: [],
  photoGalleryImage: photoGalleryImageState,
  photoGalleryImagesCount: 0,
  noPhotoGalleryImages: false
}

export const photoGalleryImageSlice = createSlice({
  name: 'photoGalleryImage',
  initialState: initialPhotoGalleryImageState,
  reducers: {
    resetPhotoGalleryImage: (state) => {
      state.error = null
      state.photoGalleryImage = photoGalleryImageState
    },
    setPhotoGalleryImages: (state, { payload }: any) => {
      state.photoGalleryImages = payload
      state.photoGalleryImagesCount = payload?.length
      state.noPhotoGalleryImages = payload?.length === 0
    },
    resetPhotoGalleryImageError: (state) => {
      state.error = null
    },
    addPhotoGalleryImageToState: (state, action) => {
      state.photoGalleryImages.push(action.payload)
      state.photoGalleryImagesCount = state.photoGalleryImagesCount + 1
      state.noPhotoGalleryImages = state.photoGalleryImages.length === 0
    },
    updatePhotoGalleryImageInState: (state, action) => {
      const updatedPhotoGalleryImage = action.payload
      const index = state.photoGalleryImages.findIndex(
        (photoGalleryImage) => photoGalleryImage.id === updatedPhotoGalleryImage.id
      )
      if (index !== -1) {
        state.photoGalleryImages[index] = updatedPhotoGalleryImage
      }
    },
    removePhotoGalleryImageFromState: (state, action) => {
      state.photoGalleryImages = state.photoGalleryImages.filter(
        (photoGalleryImage) => photoGalleryImage.id !== action.payload
      )
      state.photoGalleryImagesCount = state.photoGalleryImagesCount - 1
      state.noPhotoGalleryImages = state.photoGalleryImages.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(photoGalleryImageApi.endpoints.fetchPhotoGalleryImages.matchFulfilled, (state, { payload }: any) => {
        state.photoGalleryImages = payload.photoGalleryImages
        state.loading = false
      })
      .addMatcher(photoGalleryImageApi.endpoints.createPhotoGalleryImage.matchFulfilled, (state) => {
        state.success = true
        state.loading = false
      })
      .addMatcher(photoGalleryImageApi.endpoints.deletePhotoGalleryImage.matchFulfilled, (state) => {
        state.success = true
        state.loading = false
      })
      .addMatcher(photoGalleryImageApi.endpoints.updatePhotoGalleryImage.matchFulfilled, (state) => {
        state.success = true
        state.loading = false
      })
      .addMatcher(
        (action) => action.type.endsWith('rejected') && action.payload?.data?.sliceName === 'photoGalleryApi',
        (state, { payload }: any) => {
          state.loading = false
          state.success = false
          state.error = payload?.data?.message
        }
      )
  }
})

export const photoGalleryImageReducer = photoGalleryImageSlice.reducer as Reducer<PhotoGalleryImageStatePayload>

export const {
  resetPhotoGalleryImage,
  setPhotoGalleryImages,
  resetPhotoGalleryImageError,
  addPhotoGalleryImageToState,
  updatePhotoGalleryImageInState,
  removePhotoGalleryImageFromState
} = photoGalleryImageSlice.actions
