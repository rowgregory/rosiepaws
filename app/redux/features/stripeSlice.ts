import { Reducer, createSlice } from '@reduxjs/toolkit'
import { stripeApi } from '../services/stripeApi'

export interface StripeStatePayload {
  loading: boolean
  success: boolean
  subscription: any
  subscriptions: any
}

const initialStripeState: StripeStatePayload = {
  loading: false,
  success: false,
  subscription: null,
  subscriptions: null
}

export const stripeSlice = createSlice({
  name: 'stripe',
  initialState: initialStripeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(stripeApi.endpoints.createCustomer.matchFulfilled, (state) => {
      state.loading = false
    })
    builder.addMatcher(stripeApi.endpoints.cancelSubscription.matchFulfilled, (state) => {
      state.loading = false
    })
    builder.addMatcher(stripeApi.endpoints.createSubscription.matchFulfilled, (state) => {
      state.loading = false
    })
    builder.addMatcher(stripeApi.endpoints.updateSubscription.matchFulfilled, (state) => {
      state.loading = false
    })
  }
})

export const stripeReducer = stripeSlice.reducer as Reducer<StripeStatePayload>

export const {} = stripeSlice.actions
