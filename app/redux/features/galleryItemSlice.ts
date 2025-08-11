import { IGalleryItem } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { ErrorPayload } from '@/app/types'
import { galleryItemInitialState } from '@/app/lib/constants/public/gallery-item'
import { galleryItemApi } from '../services/galleryItemApi'

export interface GalleryItemStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  galleryItems: IGalleryItem[]
  galleryItem: IGalleryItem
  zeroGalleryItems: boolean
  galleryItemCount: number
  galleryItemDrawer: boolean
}

export const initialGalleryItemState: GalleryItemStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  galleryItems: [],
  galleryItem: galleryItemInitialState,
  zeroGalleryItems: true,
  galleryItemCount: 0,
  galleryItemDrawer: false
}

export const galleryItemSlice = createSlice({
  name: 'galleryItem',
  initialState: initialGalleryItemState,
  reducers: {
    setOpenGalleryItemDrawer: (state) => {
      state.galleryItemDrawer = true
    },
    setCloseGalleryItemDrawer: (state) => {
      state.galleryItemDrawer = false
    },
    setGalleryItems: (state, { payload }) => {
      state.galleryItems = payload
      state.zeroGalleryItems = payload.length === 0
    },
    addGalleryItemToState: (state, { payload }) => {
      state.galleryItems.unshift(payload)
      state.zeroGalleryItems = payload.length === 0
    },
    removeGalleryItemFromState: (state, action) => {
      state.galleryItems = state.galleryItems.filter(
        (galleryItem: { id: string }) => galleryItem?.id !== action.payload
      )
      state.galleryItemCount = state.galleryItemCount - 1
      state.zeroGalleryItems = state.galleryItems.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(galleryItemApi.endpoints.createGalleryItem.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(galleryItemApi.endpoints.createGalleryItem.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(galleryItemApi.endpoints.deleteGalleryItem.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(galleryItemApi.endpoints.deleteGalleryItem.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'galleryItemApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const galleryItemReducer = galleryItemSlice.reducer as Reducer<GalleryItemStatePayload>

export const {
  addGalleryItemToState,
  removeGalleryItemFromState,
  setCloseGalleryItemDrawer,
  setGalleryItems,
  setOpenGalleryItemDrawer
} = galleryItemSlice.actions
