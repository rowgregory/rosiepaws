import { PainScore } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { painScoreInitialState } from '@/app/lib/initial-states/pain-score'
import { painScoreApi } from '../services/painScoreApi'
import { ErrorPayload } from '@/app/types'

export interface PainScoreStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  painScores: PainScore[]
  painScore: PainScore
  zeroPainScores: boolean
  painScoreCreateDrawer: boolean
  painScoreUpdateDrawer: boolean
  painScoreCount: number
}

export const initialPainScoreState: PainScoreStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  painScores: [],
  painScore: painScoreInitialState,
  zeroPainScores: true,
  painScoreCreateDrawer: false,
  painScoreUpdateDrawer: false,
  painScoreCount: 0
}

export const painScoreSlice = createSlice({
  name: 'painScore',
  initialState: initialPainScoreState,
  reducers: {
    setOpenPainScoreCreateDrawer: (state) => {
      state.painScoreCreateDrawer = true
    },
    setClosePainScoreCreateDrawer: (state) => {
      state.painScoreCreateDrawer = false
    },
    setOpenPainScoreUpdateDrawer: (state) => {
      state.painScoreUpdateDrawer = true
    },
    setClosePainScoreUpdateDrawer: (state) => {
      state.painScoreUpdateDrawer = false
    },
    addPainScoresToState: (state, { payload }) => {
      state.painScores = payload
      state.zeroPainScores = payload.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(painScoreApi.endpoints.createPainScore.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(painScoreApi.endpoints.createPainScore.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(painScoreApi.endpoints.updatePainScore.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(painScoreApi.endpoints.updatePainScore.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(painScoreApi.endpoints.deletePainScore.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(painScoreApi.endpoints.deletePainScore.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'painScoreApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const painScoreReducer = painScoreSlice.reducer as Reducer<PainScoreStatePayload>

export const {
  setOpenPainScoreCreateDrawer,
  setClosePainScoreCreateDrawer,
  setOpenPainScoreUpdateDrawer,
  setClosePainScoreUpdateDrawer,
  addPainScoresToState
} = painScoreSlice.actions
