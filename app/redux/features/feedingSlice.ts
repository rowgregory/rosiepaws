import { IFeeding } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { feedingInitialState } from '@/app/lib/initial-states/feeding'
import { ErrorPayload } from '@/app/types'
import { feedingApi } from '../services/feedingApi'

export interface FeedingStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  feedings: IFeeding[]
  feeding: IFeeding
  zeroFeedings: boolean
  feedingCount: number
  feedingCreateDrawer: boolean
  feedingUpdateDrawer: boolean
}

export const initialFeedingState: FeedingStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  feedings: [],
  feeding: feedingInitialState,
  zeroFeedings: true,
  feedingCreateDrawer: false,
  feedingUpdateDrawer: false,
  feedingCount: 0
}

export const feedingSlice = createSlice({
  name: 'feeding',
  initialState: initialFeedingState,
  reducers: {
    setOpenFeedingCreateDrawer: (state) => {
      state.feedingCreateDrawer = true
    },
    setCloseFeedingCreateDrawer: (state) => {
      state.feedingCreateDrawer = false
    },
    setOpenFeedingUpdateDrawer: (state) => {
      state.feedingUpdateDrawer = true
    },
    setCloseFeedingUpdateDrawer: (state) => {
      state.feedingUpdateDrawer = false
    },
    addFeedingsToState: (state, { payload }) => {
      state.feedings = payload
      state.zeroFeedings = payload.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(feedingApi.endpoints.createFeeding.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(feedingApi.endpoints.createFeeding.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(feedingApi.endpoints.updateFeeding.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(feedingApi.endpoints.updateFeeding.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(feedingApi.endpoints.deleteFeeding.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(feedingApi.endpoints.deleteFeeding.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'feedingApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const feedingReducer = feedingSlice.reducer as Reducer<FeedingStatePayload>

export const {
  setOpenFeedingCreateDrawer,
  setCloseFeedingCreateDrawer,
  setOpenFeedingUpdateDrawer,
  setCloseFeedingUpdateDrawer,
  addFeedingsToState
} = feedingSlice.actions
