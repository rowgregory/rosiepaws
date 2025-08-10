import { IVitalSigns } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { ErrorPayload } from '@/app/types'
import { vitalSignsApi } from '../services/vitalSignsApi'
import { vitalSignsInitialState } from '@/app/lib/initial-states/vital-signs'

export interface VitalSignsStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  vitalSigns: IVitalSigns[]
  vitalSign: IVitalSigns
  zeroVitalSigns: boolean
  vitalSignsDrawer: boolean
  vitalSignsCount: number
}

export const initialVitalSignsState: VitalSignsStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  vitalSigns: [],
  vitalSign: vitalSignsInitialState,
  zeroVitalSigns: true,
  vitalSignsDrawer: false,
  vitalSignsCount: 0
}

export const vitalSignsSlice = createSlice({
  name: 'vital-signs',
  initialState: initialVitalSignsState,
  reducers: {
    setOpenVitalSignsDrawer: (state) => {
      state.vitalSignsDrawer = true
    },
    setCloseVitalSignsDrawer: (state) => {
      state.vitalSignsDrawer = false
    },
    setVitalSigns: (state, { payload }) => {
      state.vitalSigns = payload
      state.zeroVitalSigns = payload.length === 0
    },
    addVitalSignsToState: (state, { payload }) => {
      state.vitalSigns.unshift(payload)
      state.zeroVitalSigns = state.vitalSigns.length === 0
    },
    updateVitalSignsInState: (state, action) => {
      const { findById, replaceWith, ...updatedVitalSigns } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.vitalSigns.findIndex((vitalSign) => vitalSign?.id === findById)
        if (index !== -1) {
          state.vitalSigns[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.vitalSigns.findIndex((vitalSign) => vitalSign?.id === updatedVitalSigns?.id)
        if (index !== -1) {
          state.vitalSigns[index] = updatedVitalSigns
        }
      }
    },
    removeVitalSignsFromState: (state, action) => {
      state.vitalSigns = state.vitalSigns.filter((vitalSign: { id: string }) => vitalSign?.id !== action.payload)
      state.vitalSignsCount = state.vitalSignsCount - 1
      state.zeroVitalSigns = state.vitalSigns.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(vitalSignsApi.endpoints.createVitalSigns.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(vitalSignsApi.endpoints.createVitalSigns.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(vitalSignsApi.endpoints.updateVitalSigns.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(vitalSignsApi.endpoints.updateVitalSigns.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(vitalSignsApi.endpoints.deleteVitalSigns.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(vitalSignsApi.endpoints.deleteVitalSigns.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'vitalSignApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const vitalSignsReducer = vitalSignsSlice.reducer as Reducer<VitalSignsStatePayload>

export const {
  addVitalSignsToState,
  removeVitalSignsFromState,
  setCloseVitalSignsDrawer,
  setOpenVitalSignsDrawer,
  setVitalSigns,
  updateVitalSignsInState
} = vitalSignsSlice.actions
