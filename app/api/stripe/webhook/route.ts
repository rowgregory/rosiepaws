import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/logHelper'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil' // Set the correct API version
})

// Stripe webhook secret (You get this from your Stripe dashboard)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Disable the body parsing so that we can get the raw body (required by Stripe)
export const config = {
  api: {
    bodyParser: false
  }
}

// Handle the Stripe webhook events
export async function POST(req: NextRequest) {
  const reqBuffer = await req.arrayBuffer()

  // Retrieve the event by verifying the webhook signature
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(reqBuffer), req.headers.get('stripe-signature')!, endpointSecret)
  } catch (err: any) {
    return NextResponse.json({ message: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice

      // Handle successful payment, update the user's subscription status
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: invoice.customer as string }
      })

      if (user) {
        await prisma.stripeSubscription.update({
          where: { userId: user.id },
          data: {
            status: 'active',
            trialEndsAt: null // Trial is over
          }
        })
      }
      break

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice

      // Handle failed payment, update user subscription status to inactive
      const failedUser = await prisma.user.findUnique({
        where: { stripeCustomerId: failedInvoice.customer as string }
      })

      if (failedUser) {
        await prisma.stripeSubscription.update({
          where: { userId: failedUser.id },
          data: { status: 'inactive' }
        })
      }

      break

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break

    case 'customer.subscription.trial_will_end':
      //TODO
      // Handle: trial ending soon
      break

    case 'customer.subscription.deleted':
      //TODO
      // Handle: final cancellation
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}

// Handle subscription updates (status changes, plan changes, etc.)
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const dbSubscription = await prisma.stripeSubscription.findFirst({
      where: { subscriptionId: subscription.id }
    })

    if (!dbSubscription) {
      await createLog('warning', 'Subscription not found in database', {
        location: ['handleSubscriptionUpdated'],
        name: 'SubscriptionNotFound',
        timestamp: new Date().toISOString(),
        subscriptionId: subscription.id
      })
      return
    }

    // Get the current price ID from subscription items
    const currentPriceId = subscription.items.data[0]?.price?.id || dbSubscription.plan

    // Determine what changed
    const statusChanged = dbSubscription.status !== subscription.status
    const planChanged = dbSubscription.plan !== currentPriceId
    const cancelationChanged = dbSubscription.cancelAtPeriodEnd !== subscription.cancel_at_period_end

    // Update the subscription in database
    await prisma.stripeSubscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: subscription.status,
        plan: currentPriceId,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      }
    })

    // Log what changed
    const changes = []
    if (statusChanged) changes.push(`status: ${dbSubscription.status} → ${subscription.status}`)
    if (planChanged) changes.push(`plan: ${dbSubscription.plan} → ${currentPriceId}`)
    if (cancelationChanged)
      changes.push(`cancelAtPeriodEnd: ${dbSubscription.cancelAtPeriodEnd} → ${subscription.cancel_at_period_end}`)

    await createLog('info', `Subscription updated: ${changes.join(', ')}`, {
      location: ['handleSubscriptionUpdated'],
      name: 'SubscriptionUpdated',
      timestamp: new Date().toISOString(),
      subscriptionId: subscription.id,
      customerId: subscription.customer as string,
      changes: changes,
      newStatus: subscription.status
    })

    // Handle specific status changes
    if (statusChanged) {
      await handleStatusChange(subscription, dbSubscription.userId)
    }
  } catch (error: any) {
    await createLog('error', `Failed to handle subscription update: ${error.message}`, {
      location: ['handleSubscriptionUpdated'],
      errorMessage: error.message,
      timestamp: new Date().toISOString(),
      subscriptionId: subscription.id
    })
    throw error
  }
}

// Handle specific status changes
async function handleStatusChange(subscription: Stripe.Subscription, userId: string) {
  const status = subscription.status

  switch (status) {
    case 'past_due':
      await createLog('warning', 'Subscription entered dunning (past_due)', {
        location: ['handleStatusChange'],
        name: 'SubscriptionPastDue',
        timestamp: new Date().toISOString(),
        subscriptionId: subscription.id,
        userId
      })
      // Could trigger: payment failed notifications, access warnings
      break

    case 'active':
      await createLog('info', 'Subscription became active', {
        location: ['handleStatusChange'],
        name: 'SubscriptionActive',
        timestamp: new Date().toISOString(),
        subscriptionId: subscription.id,
        userId
      })
      // Could trigger: restore full access, clear warnings
      break

    case 'canceled':
      await createLog('info', 'Subscription was canceled', {
        location: ['handleStatusChange'],
        name: 'SubscriptionCanceled',
        timestamp: new Date().toISOString(),
        subscriptionId: subscription.id,
        userId
      })
      // Could trigger: revoke access, send cancellation confirmation
      break

    case 'incomplete_expired':
      await createLog('warning', 'Subscription expired due to incomplete payment', {
        location: ['handleStatusChange'],
        name: 'SubscriptionIncompleteExpired',
        timestamp: new Date().toISOString(),
        subscriptionId: subscription.id,
        userId
      })
      break
  }
}
