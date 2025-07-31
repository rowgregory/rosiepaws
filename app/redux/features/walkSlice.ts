import { IWalk } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { walkInitialState } from '@/app/lib/initial-states/walk'
import { ErrorPayload } from '@/app/types'
import { walkApi } from '../services/walkApi'

export interface WalkStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  walks: IWalk[]
  walk: IWalk
  zeroWalks: boolean
  walkCount: number
  walkCreateDrawer: boolean
  walkUpdateDrawer: boolean
}

export const initialWalkState: WalkStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  walks: [],
  walk: walkInitialState,
  zeroWalks: true,
  walkCreateDrawer: false,
  walkUpdateDrawer: false,
  walkCount: 0
}

export const walkSlice = createSlice({
  name: 'walk',
  initialState: initialWalkState,
  reducers: {
    setOpenWalkCreateDrawer: (state) => {
      state.walkCreateDrawer = true
    },
    setCloseWalkCreateDrawer: (state) => {
      state.walkCreateDrawer = false
    },
    setOpenWalkUpdateDrawer: (state) => {
      state.walkUpdateDrawer = true
    },
    setCloseWalkUpdateDrawer: (state) => {
      state.walkUpdateDrawer = false
    },
    addWalksToState: (state, { payload }) => {
      state.walks = payload
      state.zeroWalks = payload.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(walkApi.endpoints.createWalk.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(walkApi.endpoints.createWalk.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(walkApi.endpoints.updateWalk.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(walkApi.endpoints.updateWalk.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(walkApi.endpoints.deleteWalk.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(walkApi.endpoints.deleteWalk.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'walkApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const walkReducer = walkSlice.reducer as Reducer<WalkStatePayload>

export const {
  setOpenWalkCreateDrawer,
  setCloseWalkCreateDrawer,
  setOpenWalkUpdateDrawer,
  setCloseWalkUpdateDrawer,
  addWalksToState
} = walkSlice.actions
