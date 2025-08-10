import { ISeizure } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { seizureInitialState } from '@/app/lib/initial-states/seizure'
import { seizureApi } from '../services/seizureApi'
import { ErrorPayload } from '@/app/types'

export interface SeizureStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  seizures: ISeizure[]
  seizure: ISeizure
  zeroSeizures: boolean
  seizureDrawer: boolean
  seizureCount: number
}

export const initialSeizureState: SeizureStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  seizures: [],
  seizure: seizureInitialState,
  zeroSeizures: true,
  seizureDrawer: false,
  seizureCount: 0
}

export const seizureSlice = createSlice({
  name: 'seizure',
  initialState: initialSeizureState,
  reducers: {
    setOpenSeizureDrawer: (state) => {
      state.seizureDrawer = true
    },
    setCloseSeizureDrawer: (state) => {
      state.seizureDrawer = false
    },
    setSeizures: (state, { payload }) => {
      state.seizures = payload
      state.zeroSeizures = payload.length === 0
    },
    addSeizureToState: (state, { payload }) => {
      state.seizures.unshift(payload)
      state.zeroSeizures = state.seizures.length === 0
    },
    updateSeizureInState: (state, action) => {
      const { findById, replaceWith, ...updatedSeizure } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.seizures.findIndex((seizure) => seizure?.id === findById)
        if (index !== -1) {
          state.seizures[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.seizures.findIndex((seizure) => seizure?.id === updatedSeizure?.id)
        if (index !== -1) {
          state.seizures[index] = updatedSeizure
        }
      }
    },
    removeSeizureFromState: (state, action) => {
      state.seizures = state.seizures.filter((seizure: { id: string }) => seizure?.id !== action.payload)
      state.seizureCount = state.seizureCount - 1
      state.zeroSeizures = state.seizures.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(seizureApi.endpoints.createSeizure.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(seizureApi.endpoints.createSeizure.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(seizureApi.endpoints.updateSeizure.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(seizureApi.endpoints.updateSeizure.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(seizureApi.endpoints.deleteSeizure.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(seizureApi.endpoints.deleteSeizure.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'seizureApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const seizureReducer = seizureSlice.reducer as Reducer<SeizureStatePayload>

export const {
  addSeizureToState,
  removeSeizureFromState,
  setCloseSeizureDrawer,
  setOpenSeizureDrawer,
  setSeizures,
  updateSeizureInState
} = seizureSlice.actions
