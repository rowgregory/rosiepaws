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
        const { data } = await queryFulfilled
        const user = data.user
        const tokenTransaction = data.transaction

        dispatch(updateUserInUsers(user))
        dispatch(addTokenTransactionToUser({ userId: user.id, transaction: tokenTransaction }))
      }
    }),
    updateUserTier: build.mutation({
      query: ({ userId, tier }) => ({
        url: `${BASE_URL}/update-user-tier`,
        method: 'PATCH',
        body: { userId, tier }
      }),
      invalidatesTags: ['Admin', 'User']
    })
  })
})

export const {
  useFetchAdminDashboardDataQuery,
  useUpdateBackupFrequencyMutation,
  useUpdateUserTokensMutation,
  useUpdateUserTierMutation
} = adminApi
