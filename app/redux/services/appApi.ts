import { api } from './api'

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
      providesTags: ['App']
    })
  })
})

export const { useFetchAppDataQuery } = appApi
