import { addTokenTransactionToUser, updateBackupFrequency, updateUserInUsers } from '../features/adminSlice'
import { setInputs } from '../features/formSlice'
import { api } from './api'

const BASE_URL = '/admin'

export const adminApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    fetchAdminDashboardData: build.query({
      query: () => {
        return {
          url: `${BASE_URL}/fetch-dashboard-data`
        }
      },
      providesTags: ['Admin']
    }),
    updateBackupFrequency: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/update-backup-frequency`,
        method: 'PATCH',
        body
      }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newFrequency = data.frequency
        dispatch(updateBackupFrequency(newFrequency))
        dispatch(setInputs({ formName: 'settingsForm', data: { backupFrequency: newFrequency } }))
      }
    }),
    updateUserTokens: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/update-user-tokens`,
        method: 'PATCH',
        body
      }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        try {
          const { data } = await queryFulfilled
          const user = data.user
          const tokenTransaction = data.transaction

          dispatch(updateUserInUsers(user))
          dispatch(addTokenTransactionToUser({ userId: user.id, transaction: tokenTransaction }))
        } catch (error: any) {
          console.log('Error in RTK Query:', error)

          // Handle different error types here
          if (error?.error?.status === 'PARSING_ERROR') {
            console.log('Caught parsing error in RTK Query')
            // You could dispatch an error action here
            // dispatch(setErrorMessage('Service temporarily unavailable'))
          }
        }
      }
    })
  })
})

export const { useFetchAdminDashboardDataQuery, useUpdateBackupFrequencyMutation, useUpdateUserTokensMutation } =
  adminApi
