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
  waterCreateDrawer: boolean
  waterUpdateDrawer: boolean
}

export const initialWaterState: WaterStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  waters: [],
  water: waterInitialState,
  zeroWaters: true,
  waterCreateDrawer: false,
  waterUpdateDrawer: false,
  waterCount: 0
}

export const waterSlice = createSlice({
  name: 'water',
  initialState: initialWaterState,
  reducers: {
    setOpenWaterCreateDrawer: (state) => {
      state.waterCreateDrawer = true
    },
    setCloseWaterCreateDrawer: (state) => {
      state.waterCreateDrawer = false
    },
    setOpenWaterUpdateDrawer: (state) => {
      state.waterUpdateDrawer = true
    },
    setCloseWaterUpdateDrawer: (state) => {
      state.waterUpdateDrawer = false
    },
    addWatersToState: (state, { payload }) => {
      state.waters = payload
      state.zeroWaters = payload.length === 0
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
  setOpenWaterCreateDrawer,
  setCloseWaterCreateDrawer,
  setOpenWaterUpdateDrawer,
  setCloseWaterUpdateDrawer,
  addWatersToState
} = waterSlice.actions
