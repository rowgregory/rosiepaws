import Stripe from 'stripe'

/**
 * Creates a Stripe instance with environment-appropriate keys
 * Automatically switches between test and live keys based on NODE_ENV
 */
export const createStripeInstance = () => {
  const secretKey =
    process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY! : process.env.STRIPE_TEST_SECRET_KEY!

  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil'
  })
}

/**
 * Get the appropriate Stripe publishable key for client-side usage
 */
export const getStripePublishableKey = () => {
  return process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    : process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY!
}

/**
 * Get the appropriate webhook secret for the current environment
 */
export const getStripeWebhookSecret = () => {
  return process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_WEBHOOK_SECRET!
    : process.env.STRIPE_TEST_WEBHOOK_SECRET!
}

/**
 * Get product and price IDs for the current environment
 */
export const getStripeProductIds = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    comfort: {
      productId: isProduction ? process.env.STRIPE_COMFORT_PRODUCT_ID! : process.env.STRIPE_TEST_COMFORT_PRODUCT_ID!,
      priceId: isProduction ? process.env.STRIPE_COMFORT_PRICE_ID! : process.env.STRIPE_TEST_COMFORT_PRICE_ID!
    },
    legacy: {
      productId: isProduction ? process.env.STRIPE_LEGACY_PRODUCT_ID! : process.env.STRIPE_TEST_LEGACY_PRODUCT_ID!,
      priceId: isProduction ? process.env.STRIPE_LEGACY_PRICE_ID! : process.env.STRIPE_TEST_LEGACY_PRICE_ID!
    }
  }
}

// Default export for convenience
export default createStripeInstance()
