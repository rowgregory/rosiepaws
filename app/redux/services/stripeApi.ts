import { api } from './api'

const BASE_URL = '/stripe'

export const stripeApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: ({ planId, userId }) => ({
        url: `${BASE_URL}/create-checkout-session`,
        method: 'POST',
        body: { planId, userId }
      }),
      invalidatesTags: ['Stripe', 'User']
    }),
    cancelSubscription: builder.mutation({
      query: ({ userId }) => ({
        url: `${BASE_URL}/cancel-subscription`,
        method: 'POST',
        body: { userId }
      }),
      invalidatesTags: ['Stripe', 'User']
    })
  })
})

export const { useCreateCheckoutSessionMutation, useCancelSubscriptionMutation } = stripeApi
