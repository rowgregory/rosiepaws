import { Reducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { adminApi } from '../services/adminApi'
import { IUser, Pet } from '@/app/types/model.types'
import { petInitialState } from '@/app/lib/initial-states/pet'

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
  zeroUsers: number
  users: IUser[]
  actionMenu: boolean

  pets: Pet[]
  pet: Pet
  zeroPets: boolean
  petDrawer: boolean
  petCount: number
}

export const initialAdminState: AdminStatePayload = {
  loading: true,
  success: false,
  error: '',
  message: '',
  grossVolume: '',
  zeroUsers: 0,
  users: [],
  actionMenu: false,

  pets: [],
  pet: petInitialState,
  zeroPets: false,
  petDrawer: false,
  petCount: 0
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    setOpenAdminActionMenu: (state) => {
      state.actionMenu = true
    },
    setCloseAdminActionMenu: (state) => {
      state.actionMenu = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(adminApi.endpoints.fetchDashboardData.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.success = true
        state.grossVolume = payload.grossVolume
      })
      .addMatcher(adminApi.endpoints.fetchAllPets.matchFulfilled, (state, { payload }: any) => {
        state.pets = payload.pets
        state.loading = false
        state.zeroPets = payload.pets.length === 0
        state.petCount = payload.pets.length
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

export const { setOpenAdminActionMenu, setCloseAdminActionMenu } = adminSlice.actions
