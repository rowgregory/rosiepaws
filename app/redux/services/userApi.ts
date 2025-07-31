import { api } from './api'
import { removeUserFromState } from '../features/userSlice'

const BASE_URL = '/user'

export const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchUsers: build.query({
      query: () => `${BASE_URL}/fetch-users`
    }),
    fetchMe: build.query({
      query: () => `${BASE_URL}/me`
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

export const { useFetchUsersQuery, useFetchMeQuery, useDeleteUserMutation } = userApi
