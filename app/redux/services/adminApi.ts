import { api } from './api'

const BASE_URL = '/admin'

export const adminApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    fetchDashboardData: build.query({
      query: () => `${BASE_URL}/fetch-dashboard-data`,
      providesTags: ['Admin'],
      keepUnusedDataFor: 0
    }),
    fetchAllPets: build.query({
      query: () => `${BASE_URL}/fetch-all-pets`
    })
  })
})

export const { useFetchDashboardDataQuery, useFetchAllPetsQuery } = adminApi
