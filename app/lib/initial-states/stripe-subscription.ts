import { IStripeSubscription } from '@/app/types'
import { initialUserState } from './user'

export const initialStripeSubscriptionState: IStripeSubscription = {
  id: '', // Will be generated as cuid() on creation
  userId: '', // Must be provided when creating
  customerId: '', // Must be provided from Stripe customer creation
  paymentMethodId: '', // Must be provided from Stripe PaymentMethod
  subscriptionId: null, // Optional, null until active subscription created
  status: 'inactive', // Default status
  plan: 'COMFORT', // Default plan
  planPrice: 0, // Default price
  tokensIncluded: 0, // Default tokens
  trialEndsAt: null, // Optional trial end date
  cancelAtPeriodEnd: false, // Default to not canceling
  canceledAt: null, // No cancellation date initially
  currentPeriodEnd: null, // No period end initially
  paymentMethod: null, // Payment method type (optional)
  paymentMethodBrand: null, // Payment method brand (optional)
  paymentMethodLast4: null, // Last 4 digits (optional)
  createdAt: new Date(), // Current timestamp
  updatedAt: new Date(), // Current timestamp
  user: initialUserState
}
