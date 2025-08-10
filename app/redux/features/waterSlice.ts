import { IWater } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { waterInitialState } from '@/app/lib/initial-states/water'
import { ErrorPayload } from '@/app/types'
import { waterApi } from '../services/waterApi'

export interface WaterStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  waters: IWater[]
  water: IWater
  zeroWaters: boolean
  waterCount: number
  waterDrawer: boolean
}

export const initialWaterState: WaterStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  waters: [],
  water: waterInitialState,
  zeroWaters: true,
  waterDrawer: false,
  waterCount: 0
}

export const waterSlice = createSlice({
  name: 'water',
  initialState: initialWaterState,
  reducers: {
    setOpenWaterDrawer: (state) => {
      state.waterDrawer = true
    },
    setCloseWaterDrawer: (state) => {
      state.waterDrawer = false
    },
    setWaters: (state, { payload }) => {
      state.waters = payload
      state.zeroWaters = payload.length === 0
    },
    addWaterToState: (state, { payload }) => {
      state.waters.unshift(payload)
      state.zeroWaters = state.waters.length === 0
    },
    updateWaterInState: (state, action) => {
      const { findById, replaceWith, ...updatedWater } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.waters.findIndex((water) => water?.id === findById)
        if (index !== -1) {
          state.waters[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.waters.findIndex((water) => water?.id === updatedWater?.id)
        if (index !== -1) {
          state.waters[index] = updatedWater
        }
      }
    },
    removeWaterFromState: (state, action) => {
      state.waters = state.waters.filter((water: { id: string }) => water?.id !== action.payload)
      state.waterCount = state.waterCount - 1
      state.zeroWaters = state.waters.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(waterApi.endpoints.createWater.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(waterApi.endpoints.createWater.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(waterApi.endpoints.updateWater.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(waterApi.endpoints.updateWater.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(waterApi.endpoints.deleteWater.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(waterApi.endpoints.deleteWater.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'waterApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const waterReducer = waterSlice.reducer as Reducer<WaterStatePayload>

export const {
  addWaterToState,
  removeWaterFromState,
  setCloseWaterDrawer,
  setOpenWaterDrawer,
  setWaters,
  updateWaterInState
} = waterSlice.actions
