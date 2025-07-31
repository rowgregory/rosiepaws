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
  bloodSugarCreateDrawer: boolean
  bloodSugarUpdateDrawer: boolean
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
  bloodSugarCreateDrawer: false,
  bloodSugarUpdateDrawer: false,
  bloodSugarCount: 0
}

export const bloodSugarSlice = createSlice({
  name: 'bloodSugar',
  initialState: initialBloodSugarState,
  reducers: {
    setOpenBloodSugarCreateDrawer: (state) => {
      state.bloodSugarCreateDrawer = true
    },
    setCloseBloodSugarCreateDrawer: (state) => {
      state.bloodSugarCreateDrawer = false
    },
    setOpenBloodSugarUpdateDrawer: (state) => {
      state.bloodSugarUpdateDrawer = true
    },
    setCloseBloodSugarUpdateDrawer: (state) => {
      state.bloodSugarUpdateDrawer = false
    },
    addBloodSugarsToState: (state, { payload }) => {
      state.bloodSugars = payload
      state.zeroBloodSugars = payload.length === 0
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
  setOpenBloodSugarCreateDrawer,
  setCloseBloodSugarCreateDrawer,
  setOpenBloodSugarUpdateDrawer,
  setCloseBloodSugarUpdateDrawer,
  addBloodSugarsToState
} = bloodSugarSlice.actions
