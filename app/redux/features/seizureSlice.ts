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
  seizureCreateDrawer: boolean
  seizureUpdateDrawer: boolean
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
  seizureCreateDrawer: false,
  seizureUpdateDrawer: false,
  seizureCount: 0
}

export const seizureSlice = createSlice({
  name: 'seizure',
  initialState: initialSeizureState,
  reducers: {
    setOpenSeizureCreateDrawer: (state) => {
      state.seizureCreateDrawer = true
    },
    setCloseSeizureCreateDrawer: (state) => {
      state.seizureCreateDrawer = false
    },
    setOpenSeizureUpdateDrawer: (state) => {
      state.seizureUpdateDrawer = true
    },
    setCloseSeizureUpdateDrawer: (state) => {
      state.seizureUpdateDrawer = false
    },
    addSeizuresToState: (state, { payload }) => {
      state.seizures = payload
      state.zeroSeizures = payload.length === 0
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
  setOpenSeizureCreateDrawer,
  setCloseSeizureCreateDrawer,
  setOpenSeizureUpdateDrawer,
  setCloseSeizureUpdateDrawer,
  addSeizuresToState
} = seizureSlice.actions
