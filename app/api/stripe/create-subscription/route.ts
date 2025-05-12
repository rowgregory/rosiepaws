import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'
import { createLog } from '@/app/utils/logHelper'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

export async function POST(req: NextRequest) {
  const { email, priceId, paymentMethodId } = await req.json()

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      await createLog('warning', 'User not found during subscription attempt', {
        location: ['stripe route - POST /api/stripe/create-subscription'],
        name: 'UserNotFound',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })
      return NextResponse.json({ message: 'User not found', sliceName: sliceAuth }, { status: 404 })
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email })
      stripeCustomerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId }
      })
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId
    })

    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    })

    // Create subscription with 7-day trial
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      trial_period_days: 7,
      default_payment_method: paymentMethodId
    })

    // Optional: save subscription in your DB
    await prisma.stripeSubscription.create({
      data: {
        userId: user.id,
        customerId: stripeCustomerId,
        paymentMethodId,
        subscriptionId: subscription.id,
        status: subscription.status,
        plan: priceId,
        trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      }
    })

    await createLog('info', 'Stripe subscription created', {
      location: ['stripe route - POST /api/stripe/create-subscription'],
      name: 'SubscriptionCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email,
      subscriptionId: subscription.id
    })

    return NextResponse.json({ message: 'Subscription created', subscriptionId: subscription.id }, { status: 200 })
  } catch (error: any) {
    await createLog('error', `Stripe subscription creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email
    })
    return NextResponse.json({ message: 'Subscription creation failed', error, sliceName: sliceAuth }, { status: 500 })
  }
}
