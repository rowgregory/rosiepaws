import prisma from '@/prisma/client'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('HANDLE CHECKOUT COMPLETED INITIATED')

  // Check if we already processed this session
  const existingSubscription = await prisma.stripeSubscription.findFirst({
    where: {
      subscriptionId: session.subscription as string
    }
  })

  if (existingSubscription) {
    console.log('Session already processed, skipping...')
    return
  }

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.client_reference_id! // Make sure you pass this when creating checkout

  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0]?.price.id

  // Determine plan details based on what they purchased
  let plan = 'COMFORT'
  let tokensToAdd = 0
  let planPrice = 1000
  let isComfortUser = false
  let isLegacyUser = false

  if (priceId === process.env.STRIPE_COMFORT_MONTHLY_PRICE_ID) {
    plan = 'COMFORT'
    tokensToAdd = 12000 // Comfort gets 12K tokens
    planPrice = 1000 // adjust for yearly
    isComfortUser = true
  } else if (priceId === process.env.STRIPE_LEGACY_MONTHLY_PRICE_ID) {
    plan = 'LEGACY'
    tokensToAdd = 0 // Legacy = unlimited, no need to add tokens
    planPrice = 2500 // adjust for yearly
    isLegacyUser = true
  }

  const currentPeriodEnd = (subscription as any).current_period_end
    ? new Date((subscription as any).current_period_end * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  // Update or create the subscription record
  await prisma.stripeSubscription.upsert({
    where: { userId: userId },
    create: {
      userId: userId,
      customerId: customerId,
      subscriptionId: subscriptionId,
      paymentMethodId: (session as any).payment_method_id || '',
      status: subscription.status,
      plan: plan,
      planPrice: planPrice,
      tokensIncluded: tokensToAdd,
      currentPeriodEnd: currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    update: {
      subscriptionId: subscriptionId,
      status: subscription.status,
      plan: plan,
      planPrice: planPrice,
      tokensIncluded: tokensToAdd,
      currentPeriodEnd: currentPeriodEnd
    }
  })

  // Update user role (Legacy users get unlimited tokens via role check)
  const updateData: any = {
    isFreeUser: false,
    isComfortUser: isComfortUser,
    isLegacyUser: isLegacyUser,
    role: plan.toLowerCase() // 'comfort' or 'legacy'
  }

  // Only add tokens for Comfort users (Legacy is unlimited)
  if (plan === 'COMFORT') {
    updateData.tokens = { increment: tokensToAdd }
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData
  })

  console.log('HANDLE CHECKOUT COMPLETED FINISHED')
}
export default handleCheckoutCompleted
