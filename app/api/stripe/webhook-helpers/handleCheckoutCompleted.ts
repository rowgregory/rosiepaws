import prisma from '@/prisma/client'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)

  // Get the customer details from Stripe
  const customer = (await stripe.customers.retrieve(session.customer as string)) as Stripe.Customer

  console.log('CUSTOMER: ', customer)

  if (!customer.email) {
    console.error('No email found for customer')
    return
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email: customer.email }
  })
  console.log('USER: ', user)

  // If user doesn't exist, create them
  if (!user) {
    // Extract name from customer or use defaults
    const fullName = customer.name || customer.email.split('@')[0]
    const [firstName, ...lastNameParts] = fullName.split(' ')
    const lastName = lastNameParts.join(' ') || ''

    user = await prisma.user.create({
      data: {
        email: customer.email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        password: '', // You'll need to handle password setup separately
        role: 'user',
        securityQuestion: '',
        securityAnswerHash: '',
        stripeCustomerId: customer.id,
        isBasicUser: true // Will update based on actual plan below
      }
    })
  } else {
    // Update existing user with Stripe customer ID if not set
    if (!user.stripeCustomerId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id }
      })
    }
  }

  // Get the subscription details from Stripe
  const subscriptionResponse = await stripe.subscriptions.retrieve(session.subscription as string, {
    expand: ['items.data.price']
  })
  console.log('subscriptionResponse: ', subscriptionResponse)

  // Extract the actual subscription data from the response
  const subscription = subscriptionResponse as any

  // Get the price details to determine the plan
  const priceId = subscription.items.data[0].price.id
  const price = subscription.items.data[0].price

  // Map price ID to plan name (customize this based on your plans)
  const planMapping: Record<string, { name: string; userRole: string }> = {
    [`${process.env.STRIPE_COMFORT_MONTHLY_PRICE_ID}`]: { name: 'COMFORT', userRole: 'basic_user' },
    [`${process.env.STRIPE_COMPANION_MONTHLY_PRICE_ID}`]: { name: 'COMPANION', userRole: 'pro_user' },
    [`${process.env.STRIPE_LEGACY_MONTHLY_PRICE_ID}`]: { name: 'LEGACY', userRole: 'premium_user' }
  }

  const planInfo = planMapping[priceId] || { name: 'COMFORT', userRole: 'basic_user' }

  // Get default payment method
  const paymentMethodId = (subscription.default_payment_method as string) || ''

  let paymentMethodType = 'unknown'
  let paymentMethodDetails = null

  if (session.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)
    const paymentIntentData = paymentIntent as any

    if (paymentIntentData.charges?.data?.[0]?.payment_method_details) {
      const details = paymentIntentData.charges.data[0].payment_method_details
      paymentMethodType = details.type
      paymentMethodDetails = details
    }
  }

  console.log('paymentMethodDetails: ', paymentMethodDetails)

  const currentPeriodEnd = subscription.current_period_end
    ? new Date((subscription.current_period_end as number) * 1000)
    : null

  const trialEndsAt = subscription.trial_end ? new Date((subscription.trial_end as number) * 1000) : null

  // Create StripeSubscription record
  await prisma.stripeSubscription.create({
    data: {
      userId: user.id,
      customerId: customer.id,
      paymentMethodId: paymentMethodId,
      subscriptionId: subscription.id,
      status: subscription.status,
      plan: planInfo.name,
      planPrice: (price as any).unit_amount || 0,
      trialEndsAt: trialEndsAt,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: currentPeriodEnd, // Use the validated date
      paymentMethod: paymentMethodType,
      paymentMethodBrand: paymentMethodDetails?.card?.brand || null,
      paymentMethodLast4: paymentMethodDetails?.card?.last4 || null
    }
  })

  // Update user role based on plan
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isBasicUser: planInfo.userRole === 'basic_user',
      isProUser: planInfo.userRole === 'pro_user',
      isPremiumUser: planInfo.userRole === 'premium_user',
      isFreeUser: false,
      role: planInfo.userRole
    }
  })

  console.log('Subscription created successfully for user:', user.id)
  console.log('User created/updated:', user.id)
}

export default handleCheckoutCompleted
