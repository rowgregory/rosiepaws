import { IMedia } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { mediaInitialState } from '@/app/lib/initial-states/media'
import { mediaApi } from '../services/mediaApi'
import { ErrorPayload } from '@/app/types'

export interface MediaStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  medias: IMedia[]
  media: IMedia
  zeroMedias: boolean
  mediaCreateDrawer: boolean
  mediaUpdateDrawer: boolean
  mediaCount: number
}

export const initialMediaState: MediaStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  medias: [],
  media: mediaInitialState,
  zeroMedias: true,
  mediaCreateDrawer: false,
  mediaUpdateDrawer: false,
  mediaCount: 0
}

export const mediaSlice = createSlice({
  name: 'media',
  initialState: initialMediaState,
  reducers: {
    setOpenMediaCreateDrawer: (state) => {
      state.mediaCreateDrawer = true
    },
    setCloseMediaCreateDrawer: (state) => {
      state.mediaCreateDrawer = false
    },
    setOpenMediaUpdateDrawer: (state) => {
      state.mediaUpdateDrawer = true
    },
    setCloseMediaUpdateDrawer: (state) => {
      state.mediaUpdateDrawer = false
    },
    addMediasToState: (state, { payload }) => {
      state.medias = payload
      state.zeroMedias = payload.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(mediaApi.endpoints.createMedia.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(mediaApi.endpoints.createMedia.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(mediaApi.endpoints.getAllMedia.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(mediaApi.endpoints.getAllMedia.matchFulfilled, (state, { payload }: any) => {
        state.loading = false
        state.medias = payload.media
      })
      .addMatcher(mediaApi.endpoints.deleteMedia.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(mediaApi.endpoints.deleteMedia.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(mediaApi.endpoints.updateAnalytics.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(mediaApi.endpoints.updateAnalytics.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(mediaApi.endpoints.updateMedia.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(mediaApi.endpoints.updateMedia.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'mediaApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const mediaReducer = mediaSlice.reducer as Reducer<MediaStatePayload>

export const {
  setOpenMediaCreateDrawer,
  setCloseMediaCreateDrawer,
  setOpenMediaUpdateDrawer,
  setCloseMediaUpdateDrawer,
  addMediasToState
} = mediaSlice.actions
