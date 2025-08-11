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
  painDrawer: boolean
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
  painDrawer: false,
  painScoreCount: 0
}

export const painScoreSlice = createSlice({
  name: 'painScore',
  initialState: initialPainScoreState,
  reducers: {
    setOpenPainDrawer: (state) => {
      state.painDrawer = true
    },
    setClosePainDrawer: (state) => {
      state.painDrawer = false
    },
    setPainScores: (state, { payload }) => {
      state.painScores = payload
      state.zeroPainScores = payload.length === 0
    },
    addPainScoreToState: (state, { payload }) => {
      state.painScores.unshift(payload)
      state.zeroPainScores = state.painScores.length === 0
    },
    updatePainScoreInState: (state, action) => {
      const { findById, replaceWith, ...updatedPainScore } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.painScores.findIndex((pain) => pain?.id === findById)
        if (index !== -1) {
          state.painScores[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.painScores.findIndex((pain) => pain?.id === updatedPainScore?.id)
        if (index !== -1) {
          state.painScores[index] = updatedPainScore
        }
      }
    },
    removePainScoreFromState: (state, action) => {
      state.painScores = state.painScores.filter((pain: { id: string }) => pain?.id !== action.payload)
      state.painScoreCount = state.painScoreCount - 1
      state.zeroPainScores = state.painScores.length === 0
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
  addPainScoreToState,
  removePainScoreFromState,
  setClosePainDrawer,
  setOpenPainDrawer,
  setPainScores,
  updatePainScoreInState
} = painScoreSlice.actions
