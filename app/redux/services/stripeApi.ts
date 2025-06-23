// api/subscriptionApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const stripeApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Stripe'],
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query({
      query: (email) => ({
        url: 'user/subscription-status',
        method: 'POST',
        body: { email }
      }),
      providesTags: ['Stripe']
    }),

    updateSubscription: builder.mutation({
      query: ({ email, newPlan }) => ({
        url: 'stripe/update-subscription',
        method: 'POST',
        body: { email, newPlan }
      }),
      // Invalidate subscription cache to trigger refetch
      invalidatesTags: ['Stripe']
    }),

    cancelSubscription: builder.mutation({
      query: ({ email, cancelAtPeriodEnd = true }) => ({
        url: 'stripe/cancel-subscription',
        method: 'POST',
        body: { email, cancelAtPeriodEnd }
      }),
      invalidatesTags: ['Stripe']
    }),

    createCustomer: builder.mutation({
      query: (email) => ({
        url: 'stripe/create-customer',
        method: 'POST',
        body: { email }
      }),
      invalidatesTags: ['Stripe']
    }),

    createSubscription: builder.mutation({
      query: (email) => ({
        url: 'stripe/create-subscription',
        method: 'POST',
        body: { email }
      }),
      invalidatesTags: ['Stripe']
    })
  })
})

export const {
  useGetSubscriptionStatusQuery,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useCreateCustomerMutation
} = stripeApi
