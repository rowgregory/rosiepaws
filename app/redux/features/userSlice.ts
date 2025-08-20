import { Reducer, createSlice } from '@reduxjs/toolkit'
import { userApi } from '../services/userApi'
import { IUser } from '@/app/types'
import { initialUserState } from '@/app/lib/initial-states/user'

export interface UserStatePayload {
  loading: boolean
  error: any
  success: boolean
  users: IUser[]
  user: IUser
  usersCount: number
  noUsers: boolean
  tokenTransactions: any[]
}

const userInitialState: UserStatePayload = {
  loading: true,
  error: null,
  success: false,
  users: [],
  user: initialUserState,
  usersCount: 0,
  noUsers: false,
  tokenTransactions: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    clearUser: (state) => {
      state.error = null
      state.loading = false
      state.success = false
      state.user = initialUserState
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
  setTokenTransactions
} = userSlice.actions
