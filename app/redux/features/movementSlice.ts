import { IMovement } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { movementInitialState } from '@/app/lib/initial-states/movement'
import { movementApi } from '../services/movementApi'
import { ErrorPayload } from '@/app/types'

export interface MovementStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  movements: IMovement[]
  movement: IMovement
  zeroMovements: boolean
  movementCreateDrawer: boolean
  movementUpdateDrawer: boolean
  movementCount: number
}

export const initialMovementState: MovementStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  movements: [],
  movement: movementInitialState,
  zeroMovements: true,
  movementCreateDrawer: false,
  movementUpdateDrawer: false,
  movementCount: 0
}

export const movementSlice = createSlice({
  name: 'movement',
  initialState: initialMovementState,
  reducers: {
    setOpenMovementCreateDrawer: (state) => {
      state.movementCreateDrawer = true
    },
    setCloseMovementCreateDrawer: (state) => {
      state.movementCreateDrawer = false
    },
    setOpenMovementUpdateDrawer: (state) => {
      state.movementUpdateDrawer = true
    },
    setCloseMovementUpdateDrawer: (state) => {
      state.movementUpdateDrawer = false
    },
    addMovementsToState: (state, { payload }) => {
      state.movements = payload
      state.zeroMovements = payload.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(movementApi.endpoints.createMovement.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(movementApi.endpoints.createMovement.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(movementApi.endpoints.updateMovement.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(movementApi.endpoints.updateMovement.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(movementApi.endpoints.deleteMovement.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(movementApi.endpoints.deleteMovement.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'movementApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const movementReducer = movementSlice.reducer as Reducer<MovementStatePayload>

export const {
  setOpenMovementCreateDrawer,
  setCloseMovementCreateDrawer,
  setOpenMovementUpdateDrawer,
  setCloseMovementUpdateDrawer,
  addMovementsToState
} = movementSlice.actions
