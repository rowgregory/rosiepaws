import { api } from './api'
import { removeUserFromState } from '../features/userSlice'

const BASE_URL = '/user'

export const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchUsers: build.query({
      query: () => `${BASE_URL}/fetch-users`
    }),
    updateUserRole: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/update-user-role`, method: 'PUT', body }),
      invalidatesTags: (_: any, __: any, arg: { id: string }) => [{ type: 'User', id: arg.id }]
    }),
    updateUserProfile: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/update-user-profile`, method: 'PUT', body }),
      invalidatesTags: (_: any, __: any, arg: { id: string }) => [{ type: 'User', id: arg.id }]
    }),
    deleteUser: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/delete-user`, method: 'DELETE', body }),
      onQueryStarted: async (arg: any, { dispatch, queryFulfilled }: any) => {
        await queryFulfilled
        dispatch(removeUserFromState(arg.id))
      }
    })
  })
})

export const { useFetchUsersQuery, useUpdateUserRoleMutation, useUpdateUserProfileMutation, useDeleteUserMutation } =
  userApi
