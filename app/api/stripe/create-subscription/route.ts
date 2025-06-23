import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { parseStack } from 'error-stack-parser-es/lite'
import { sliceAuth } from '@/public/data/api.data'
import { createLog } from '@/app/lib/utils/logHelper'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

export async function POST(req: NextRequest) {
  const { email, priceId, paymentMethodId } = await req.json()

  // Input validation
  if (!email || !priceId || !paymentMethodId) {
    return NextResponse.json(
      {
        message: 'Missing required fields: email, priceId, paymentMethodId',
        sliceName: sliceAuth
      },
      { status: 400 }
    )
  }

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

    // Check if user already has an active subscription
    const existingSubscription = await prisma.stripeSubscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['active', 'trialing', 'past_due'] }
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        {
          message: 'User already has an active subscription',
          sliceName: sliceAuth
        },
        { status: 400 }
      )
    }

    // Ensure user has a Stripe customer ID
    if (!user.stripeCustomerId) {
      await createLog('error', 'User missing Stripe customer ID', {
        location: ['stripe route - POST /api/stripe/create-subscription'],
        name: 'MissingStripeCustomer',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })
      return NextResponse.json(
        {
          message: 'User must have a Stripe customer account first',
          sliceName: sliceAuth
        },
        { status: 400 }
      )
    }

    const stripeCustomerId = user.stripeCustomerId

    // Verify payment method exists and attach to customer
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

      if (paymentMethod.customer !== stripeCustomerId) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomerId
        })
      }
    } catch {
      await createLog('error', 'Invalid payment method', {
        location: ['stripe route - POST /api/stripe/create-subscription'],
        name: 'InvalidPaymentMethod',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email,
        paymentMethodId
      })
      return NextResponse.json(
        {
          message: 'Invalid payment method',
          sliceName: sliceAuth
        },
        { status: 400 }
      )
    }

    // Set as default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    })

    // Create subscription with 7-day trial
    const subscription = (await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      trial_period_days: 7,
      default_payment_method: paymentMethodId,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    })) as Stripe.Subscription

    // Save subscription in your DB
    await prisma.stripeSubscription.create({
      data: {
        userId: user.id,
        customerId: stripeCustomerId,
        paymentMethodId,
        subscriptionId: subscription.id,
        status: subscription.status,
        plan: priceId,
        trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        cancelAtPeriodEnd: false
      }
    })

    await createLog('info', 'Stripe subscription created', {
      location: ['stripe route - POST /api/stripe/create-subscription'],
      name: 'SubscriptionCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email,
      subscriptionId: subscription.id,
      status: subscription.status
    })

    // Handle different subscription statuses
    if (subscription.status === 'incomplete') {
      const latestInvoice = subscription.latest_invoice as any
      const paymentIntent = latestInvoice?.payment_intent
      return NextResponse.json(
        {
          message: 'Subscription requires payment confirmation',
          subscriptionId: subscription.id,
          clientSecret: paymentIntent?.client_secret,
          status: subscription.status
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        message: 'Subscription created successfully',
        subscriptionId: subscription.id,
        status: subscription.status,
        trialEnd: subscription.trial_end
      },
      { status: 200 }
    )
  } catch (error: any) {
    await createLog('error', `Stripe subscription creation failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      email,
      stripeErrorCode: error.code || null,
      stripeErrorType: error.type || null
    })

    return NextResponse.json(
      {
        message: 'Subscription creation failed',
        error: error.message,
        sliceName: sliceAuth
      },
      { status: 500 }
    )
  }
}
