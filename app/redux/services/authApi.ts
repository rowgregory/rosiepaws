import { setAuthState } from '../features/authSlice'
import { api } from './api'

const BASE_URL = '/auth'

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    register: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/register`,
        method: 'POST',
        body
      })
    }),
    logout: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/logout`,
        method: 'POST',
        body
      })
    }),
    login: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/login`,
        method: 'POST',
        body
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // Wait for the mutation to succeed
          const { data } = await queryFulfilled
          dispatch(setAuthState(data.payload))
        } catch {}
      }
    }),
    forgotPassword: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/forgot-password`,
        method: 'POST',
        body
      })
    }),
    resetPassword: build.mutation({
      query: (body) => ({
        url: `${BASE_URL}/reset-password`,
        method: 'PATCH',
        body
      })
    }),
    authSystemStatus: build.query({
      query: () => `${BASE_URL}/system-status`,
      providesTags: ['Auth'],
      keepUnusedDataFor: 0
    })
  })
})

export const {
  useRegisterMutation,
  useLogoutMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useAuthSystemStatusQuery
} = authApi
