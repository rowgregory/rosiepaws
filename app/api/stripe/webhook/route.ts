import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/prisma/client'

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

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
