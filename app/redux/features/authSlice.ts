import { Reducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authApi } from '../services/authApi'

// interface AuthResponsePayload {
//   isAuthenticated: boolean
//   id: string
//   role: string
// }

interface ErrorPayload {
  data: {
    message: string
  }
}

export interface AuthStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  isAuthenticated: boolean | null
  userId: string
  role: string
  passwordReset: boolean
}

export const initialAuthState: AuthStatePayload = {
  loading: true,
  success: false,
  error: '',
  message: '',
  isAuthenticated: false,
  userId: '',
  role: '',
  passwordReset: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setAuthState: (state, { payload }: PayloadAction<{ isAuthenticated: boolean; id: string; role: string }>) => {
      state.isAuthenticated = payload.isAuthenticated
      state.userId = payload.id
      state.role = payload.role
    },
    resetAuth: (state) => {
      state.success = false
      state.loading = false
      state.passwordReset = false
    },
    resetAuthError: (state) => {
      state.error = ''
    },
    resetAuthSuccess: (state) => {
      state.success = false
    },
    resetAuthPasswordReset: (state) => {
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }: any) => {
        state.loading = false
        state.isAuthenticated = payload.payload.isAuthenticated
        state.userId = payload.payload.id
        state.role = payload.payload.role
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.userId = ''
      })
      .addMatcher(
        authApi.endpoints.forgotPassword.matchFulfilled,
        (state, { payload }: PayloadAction<{ id: string }>) => {
          state.loading = false
          state.userId = payload.id
          state.success = true
        }
      )
      .addMatcher(
        authApi.endpoints.resetPassword.matchFulfilled,
        (state, { payload }: PayloadAction<{ passwordReset: boolean }>) => {
          state.loading = false
          state.passwordReset = payload.passwordReset
        }
      )
      .addMatcher(
        (action): action is PayloadAction<ErrorPayload> =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'authApi',
        (state, action) => {
          state.loading = false
          state.error = action.payload.data?.message
        }
      )
  }
})

export const authReducer = authSlice.reducer as Reducer<AuthStatePayload>

export const { setAuthState, resetAuth, resetAuthError, resetAuthSuccess, resetAuthPasswordReset } = authSlice.actions
