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
  movementDrawer: boolean
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
  movementDrawer: false,
  movementCount: 0
}

export const movementSlice = createSlice({
  name: 'movement',
  initialState: initialMovementState,
  reducers: {
    setOpenMovementDrawer: (state) => {
      state.movementDrawer = true
    },
    setCloseMovementDrawer: (state) => {
      state.movementDrawer = false
    },
    setMovements: (state, { payload }) => {
      state.movements = payload
      state.zeroMovements = payload.length === 0
    },
    addMovementToState: (state, { payload }) => {
      state.movements.unshift(payload)
      state.zeroMovements = state.movements.length === 0
    },
    updateMovementInState: (state, action) => {
      const { findById, replaceWith } = action.payload

      if (findById && replaceWith) {
        const index = state.movements.findIndex((movement) => movement?.id === findById)

        if (index !== -1) {
          // Item exists - update it
          state.movements[index] = replaceWith
        } else {
          // Item doesn't exist (was deleted optimistically) - add it back
          state.movements.push(replaceWith)
          state.zeroMovements = state.movements.length === 0
        }
      } else {
        // Normal update
        const updatedMovement = action.payload
        const index = state.movements.findIndex((movement) => movement?.id === updatedMovement?.id)
        if (index !== -1) {
          state.movements[index] = updatedMovement
        }
      }
    },
    removeMovementFromState: (state, action) => {
      state.movements = state.movements.filter((movement: { id: string }) => movement?.id !== action.payload)
      state.movementCount = state.movementCount - 1
      state.zeroMovements = state.movements.length === 0
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
  addMovementToState,
  removeMovementFromState,
  setCloseMovementDrawer,
  setMovements,
  setOpenMovementDrawer,
  updateMovementInState
} = movementSlice.actions
