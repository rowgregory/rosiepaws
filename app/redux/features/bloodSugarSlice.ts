import { IBloodSugar } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { bloodSugarInitialState } from '@/app/lib/initial-states/bloodSugar'
import { bloodSugarApi } from '../services/bloodSugarApi'
import { ErrorPayload } from '@/app/types'

export interface BloodSugarStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  bloodSugars: IBloodSugar[]
  bloodSugar: IBloodSugar
  zeroBloodSugars: boolean
  bloodSugarDrawer: boolean
  bloodSugarCount: number
}

export const initialBloodSugarState: BloodSugarStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  bloodSugars: [],
  bloodSugar: bloodSugarInitialState,
  zeroBloodSugars: true,
  bloodSugarDrawer: false,
  bloodSugarCount: 0
}

export const bloodSugarSlice = createSlice({
  name: 'bloodSugar',
  initialState: initialBloodSugarState,
  reducers: {
    setOpenBloodSugarDrawer: (state) => {
      state.bloodSugarDrawer = true
    },
    setCloseBloodSugarDrawer: (state) => {
      state.bloodSugarDrawer = false
    },
    setBloodSugars: (state, { payload }) => {
      state.bloodSugars = payload
      state.zeroBloodSugars = payload.length === 0
    },
    addBloodSugarToState: (state, { payload }) => {
      state.bloodSugars.unshift(payload)
      state.zeroBloodSugars = state.bloodSugars.length === 0
    },
    updateBloodSugarInState: (state, action) => {
      const { findById, replaceWith, ...updatedBloodSugar } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.bloodSugars.findIndex((bloodSugar) => bloodSugar?.id === findById)
        if (index !== -1) {
          state.bloodSugars[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.bloodSugars.findIndex((bloodSugar) => bloodSugar?.id === updatedBloodSugar?.id)
        if (index !== -1) {
          state.bloodSugars[index] = updatedBloodSugar
        }
      }
    },
    removeBloodSugarFromState: (state, action) => {
      state.bloodSugars = state.bloodSugars.filter((bloodSugar: { id: string }) => bloodSugar?.id !== action.payload)
      state.bloodSugarCount = state.bloodSugarCount - 1
      state.zeroBloodSugars = state.bloodSugars.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(bloodSugarApi.endpoints.createBloodSugar.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(bloodSugarApi.endpoints.createBloodSugar.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(bloodSugarApi.endpoints.updateBloodSugar.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(bloodSugarApi.endpoints.updateBloodSugar.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(bloodSugarApi.endpoints.deleteBloodSugar.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(bloodSugarApi.endpoints.deleteBloodSugar.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'bloodSugarApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const bloodSugarReducer = bloodSugarSlice.reducer as Reducer<BloodSugarStatePayload>

export const {
  addBloodSugarToState,
  removeBloodSugarFromState,
  setBloodSugars,
  setCloseBloodSugarDrawer,
  setOpenBloodSugarDrawer,
  updateBloodSugarInState
} = bloodSugarSlice.actions
