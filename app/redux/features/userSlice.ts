import { Reducer, createSlice } from '@reduxjs/toolkit'
import { userApi } from '../services/userApi'
import { IUser } from '@/app/types'

export interface UserStatePayload {
  loading: boolean
  error: any
  success: boolean
  users: IUser[]
  user: IUser | null
  usersCount: number
  noUsers: boolean
  tokenTransactions: any[]
  isWaitingForWebhook: boolean
}

const userInitialState: UserStatePayload = {
  loading: true,
  error: null,
  success: false,
  users: [],
  user: null,
  usersCount: 0,
  noUsers: false,
  tokenTransactions: [],
  isWaitingForWebhook: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    clearUser: (state) => {
      state.error = null
      state.loading = false
      state.success = false
      state.user = null
    },
    setUsers: (state, { payload }: any) => {
      state.users = payload
      state.usersCount = payload?.length
      state.noUsers = payload?.length === 0
    },
    setUser: (state, { payload }) => {
      state.user = payload
      state.loading = false
    },
    setTokenTransactions: (state, { payload }) => {
      state.tokenTransactions = payload
    },
    resetUserError: (state) => {
      state.error = null
    },
    removeUserFromState: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },
    updateUserTokens: (state, { payload }) => {
      if (state.user) {
        state.user.tokens = payload.tokens
        state.user.tokensUsed = payload.tokensUsed
      }
    },
    setIsWaitingForWebhook: (state) => {
      state.isWaitingForWebhook = true
    },
    setIsNotWaitingForWebhook: (state) => {
      state.isWaitingForWebhook = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.fetchUsers.matchFulfilled, (state, { payload }: any) => {
        state.users = payload.users
        state.loading = false
      })
      .addMatcher(userApi.endpoints.fetchMe.matchFulfilled, (state) => {
        state.success = true
        state.loading = false
      })
      .addMatcher(userApi.endpoints.deleteUser.matchFulfilled, (state) => {
        state.success = true
        state.loading = false
      })
      .addMatcher(
        (action) => action.type.endsWith('rejected') && action.payload?.data?.sliceName === 'userApi',
        (state, { payload }: any) => {
          state.loading = false
          state.error = payload?.data?.message
        }
      )
  }
})

export const userReducer = userSlice.reducer as Reducer<UserStatePayload>

export const {
  clearUser,
  setUsers,
  setUser,
  resetUserError,
  removeUserFromState,
  updateUserTokens,
  setTokenTransactions,
  setIsNotWaitingForWebhook,
  setIsWaitingForWebhook
} = userSlice.actions
