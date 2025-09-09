import Stripe from 'stripe'
import { getStripeProductIds } from '../../utils/common/stripe'

function determinePlanFromSubscription(subscription: Stripe.Subscription): string {
  if (!subscription.items?.data?.length) {
    return 'FREE'
  }

  const priceId = subscription.items.data[0].price.id
  const stripeProductIds = getStripeProductIds()

  // Check against Comfort plan prices
  if (priceId === stripeProductIds.comfort.priceId) {
    return 'COMFORT'
  }

  // Check against Legacy plan prices
  if (priceId === stripeProductIds.legacy.priceId) {
    return 'LEGACY'
  }

  // Default to FREE if no match found
  return 'FREE'
}

export default determinePlanFromSubscription
