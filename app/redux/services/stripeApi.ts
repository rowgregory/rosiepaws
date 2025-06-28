import { api } from './api'

const BASE_URL = '/stripe'

export const stripeApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: ({ planId }) => ({
        url: `${BASE_URL}/create-checkout-session`,
        method: 'POST',
        body: { planId }
      }),
      // Invalidate subscription cache to trigger refetch
      invalidatesTags: ['Stripe']
    }),
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
  useCreateCheckoutSessionMutation,
  useGetSubscriptionStatusQuery,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useCreateCustomerMutation
} = stripeApi
