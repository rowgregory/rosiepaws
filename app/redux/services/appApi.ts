import { setDashboardError } from '../features/dashboardSlice'
import { setPhotoGalleryImages } from '../features/photoGalleryImageSlice'
import { setTextBlocks } from '../features/textBlockSlice'
import { setUser, setUsers } from '../features/userSlice'
import { api } from './api'
import { setLogs } from '../features/logSlice'

const BASE_URL = '/app'

export const appApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchAppData: build.query({
      query: () => {
        return {
          url: `${BASE_URL}/fetch-app-data`
        }
      },
      onQueryStarted: async (_arg: any, { dispatch, queryFulfilled }: any) => {
        // if (handleOffline(signal)) {
        //   dispatch(setDashboardError('You are offline. Please check your internet connection.'))
        //   return
        // }
        try {
          const {
            data: { textBlocks, photoGalleryImages }
          } = await queryFulfilled

          dispatch(setTextBlocks(textBlocks))
          dispatch(setPhotoGalleryImages(photoGalleryImages))
        } catch (error: any) {
          if (error instanceof Error && error.message === 'Network disconnected') {
            dispatch(setDashboardError('Request canceled due to lost connection.'))
          } else {
            dispatch(setDashboardError('Something went wrong loading the dashboard.'))
          }
        }
      },
      providesTags: ['App']
    }),
    fetchDashboardData: build.query({
      query: () => {
        return {
          url: `${BASE_URL}/fetch-dashboard-data`
        }
      },
      onQueryStarted: async (_arg: any, { dispatch, queryFulfilled }: any) => {
        // if (handleOffline(signal)) {
        //   dispatch(setDashboardError('You are offline. Please check your internet connection.'))
        //   return
        // }

        try {
          const {
            data: { users, user, logs }
          } = await queryFulfilled

          dispatch(setUsers(users))
          dispatch(setUser(user))
          dispatch(setLogs(logs))
        } catch (error: any) {
          if (error instanceof Error && error.message === 'Network disconnected') {
            dispatch(setDashboardError('Request canceled due to lost connection.'))
          } else {
            dispatch(setDashboardError('Something went wrong loading the dashboard.'))
          }
        }
      },
      providesTags: ['App']
    })
  })
})

export const { useFetchAppDataQuery, useFetchDashboardDataQuery } = appApi
