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
  feedingDrawer: boolean
}

export const initialFeedingState: FeedingStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  feedings: [],
  feeding: feedingInitialState,
  zeroFeedings: true,
  feedingCount: 0,
  feedingDrawer: false
}

export const feedingSlice = createSlice({
  name: 'feeding',
  initialState: initialFeedingState,
  reducers: {
    setOpenFeedingDrawer: (state) => {
      state.feedingDrawer = true
    },
    setCloseFeedingDrawer: (state) => {
      state.feedingDrawer = false
    },
    setFeedings: (state, { payload }) => {
      state.feedings = payload
      state.zeroFeedings = payload.length === 0
    },
    addFeedingToState: (state, { payload }) => {
      state.feedings.unshift(payload)
      state.zeroFeedings = payload.length === 0
    },
    updateFeedingInState: (state, action) => {
      const { findById, replaceWith, ...updatedFeeding } = action.payload

      if (findById && replaceWith) {
        const index = state.feedings.findIndex((feeding) => feeding?.id === findById)

        if (index !== -1) {
          // Item exists - update it
          state.feedings[index] = replaceWith
        } else {
          // Item doesn't exist (was deleted optimistically) - add it back
          state.feedings.push(replaceWith)
          state.zeroFeedings = state.feedings.length === 0
        }
      } else {
        // Normal update
        const index = state.feedings.findIndex((feeding) => feeding?.id === updatedFeeding?.id)
        if (index !== -1) {
          state.feedings[index] = updatedFeeding
        }
      }
    },
    removeFeedingFromState: (state, action) => {
      state.feedings = state.feedings.filter((feeding: { id: string }) => feeding?.id !== action.payload)
      state.feedingCount = state.feedingCount - 1
      state.zeroFeedings = state.feedings.length === 0
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
  setOpenFeedingDrawer,
  setCloseFeedingDrawer,
  setFeedings,
  addFeedingToState,
  updateFeedingInState,
  removeFeedingFromState
} = feedingSlice.actions
