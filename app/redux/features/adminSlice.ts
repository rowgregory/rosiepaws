import { Reducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { adminApi } from '../services/adminApi'

interface ErrorPayload {
  data: {
    message: string
  }
}

export interface AdminStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  grossVolume: number | string
}

export const initialAdminState: AdminStatePayload = {
  loading: true,
  success: false,
  error: '',
  message: '',
  grossVolume: ''
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(adminApi.endpoints.fetchDashboardData.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.success = true
        state.grossVolume = payload.grossVolume
      })
      .addMatcher(
        (action): action is PayloadAction<ErrorPayload> =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'adminApi',
        (state, action) => {
          state.loading = false
          state.error = action.payload.data?.message
        }
      )
  }
})

export const adminReducer = adminSlice.reducer as Reducer<AdminStatePayload>

export const {} = adminSlice.actions
