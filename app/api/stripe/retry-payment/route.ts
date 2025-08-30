import { createLog } from '@/app/lib/api/createLog'
import getNextSteps from '@/app/lib/api/getNextSteps'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createStripeInstance } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import { sliceStripe } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Check user authentication and admin permissions
    const userHeader = req.headers.get('x-user')
    if (!userHeader) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing user header', sliceName: sliceStripe },
        { status: 401 }
      )
    }

    const parsedUser = JSON.parse(userHeader)
    if (!parsedUser.isAdmin) {
      return NextResponse.json({ message: 'Forbidden: Admins only', sliceName: sliceStripe }, { status: 403 })
    }

    // Parse request body
    const body = await req.json()
    const { subscriptionId } = body

    // Validate required fields
    if (!subscriptionId) {
      return NextResponse.json({ message: 'Subscription ID is required', sliceName: sliceStripe }, { status: 400 })
    }

    // Get subscription from database
    const subscription = await prisma.stripeSubscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true }
    })

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription not found', sliceName: sliceStripe }, { status: 404 })
    }

    // Check if subscription is in a state that can be retried
    if (subscription.status !== 'past_due' && subscription.status !== 'incomplete') {
      return NextResponse.json(
        {
          message: 'Subscription is not in a state that requires payment retry',
          currentStatus: subscription.status,
          sliceName: sliceStripe
        },
        { status: 400 }
      )
    }

    const stripe = createStripeInstance()

    // Ensure we have a Stripe subscription ID and payment method
    if (!subscription.subscriptionId) {
      return NextResponse.json({ message: 'No Stripe subscription ID found', sliceName: sliceStripe }, { status: 400 })
    }

    if (!subscription.paymentMethodId) {
      return NextResponse.json({ message: 'No payment method ID found', sliceName: sliceStripe }, { status: 400 })
    }

    // Get the Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.subscriptionId)
    if (!stripeSubscription) {
      return NextResponse.json({ message: 'Stripe subscription not found', sliceName: sliceStripe }, { status: 404 })
    }

    let result: any = {}

    if (subscription.status === 'past_due') {
      // For past_due subscriptions, get the latest invoice and retry payment
      const invoices = await stripe.invoices.list({
        subscription: subscription.subscriptionId,
        limit: 1,
        status: 'open'
      })

      if (invoices.data.length === 0) {
        return NextResponse.json(
          { message: 'No open invoices found to retry', sliceName: sliceStripe },
          { status: 400 }
        )
      }

      const latestInvoice = invoices.data[0]

      // Ensure we have a valid invoice ID
      if (!latestInvoice.id) {
        return NextResponse.json({ message: 'Invalid invoice found - no ID', sliceName: sliceStripe }, { status: 400 })
      }

      // Attempt to pay the invoice
      try {
        const paidInvoice = await stripe.invoices.pay(latestInvoice.id, {
          payment_method: subscription.paymentMethodId
        })

        result = {
          type: 'invoice_payment',
          invoiceId: paidInvoice.id,
          status: paidInvoice.status,
          amountPaid: paidInvoice.amount_paid
        }

        // Update subscription status in database if payment succeeded
        if (paidInvoice.status === 'paid') {
          await prisma.stripeSubscription.update({
            where: { id: subscription.id },
            data: {
              status: 'active',
              updatedAt: new Date()
            }
          })
        }
      } catch (paymentError: any) {
        // Payment failed, but we still want to return useful information
        result = {
          type: 'invoice_payment',
          invoiceId: latestInvoice.id,
          status: 'payment_failed',
          error: paymentError.message,
          declineCode: paymentError.decline_code || null
        }
      }
    } else if (subscription.status === 'incomplete') {
      // For incomplete subscriptions, try to confirm the latest payment intent
      const paymentIntents = await stripe.paymentIntents.list({
        customer: subscription.customerId,
        limit: 1
      })

      if (paymentIntents.data.length === 0) {
        return NextResponse.json(
          { message: 'No payment intents found to retry', sliceName: sliceStripe },
          { status: 400 }
        )
      }

      const latestPaymentIntent = paymentIntents.data[0]

      try {
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(latestPaymentIntent.id, {
          payment_method: subscription.paymentMethodId
        })

        result = {
          type: 'payment_intent',
          paymentIntentId: confirmedPaymentIntent.id,
          status: confirmedPaymentIntent.status,
          amount: confirmedPaymentIntent.amount
        }

        // Update subscription status if payment succeeded
        if (confirmedPaymentIntent.status === 'succeeded') {
          await prisma.stripeSubscription.update({
            where: { id: subscription.id },
            data: {
              status: 'active',
              updatedAt: new Date()
            }
          })
        }
      } catch (paymentError: any) {
        result = {
          type: 'payment_intent',
          paymentIntentId: latestPaymentIntent.id,
          status: 'failed',
          error: paymentError.message,
          declineCode: paymentError.decline_code || null
        }
      }
    }

    // Log the retry attempt for audit purposes
    await createLog('info', `Payment retry attempted by admin ${parsedUser.id}`, {
      adminUserId: parsedUser.id,
      action: 'RETRY_PAYMENT',
      targetType: 'SUBSCRIPTION',
      targetId: subscription.id,
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      customerEmail: subscription.user.email,
      result,
      timestamp: new Date().toISOString()
    })

    // Return success response with detailed result
    return NextResponse.json(
      {
        success: true,
        message: 'Payment retry completed',
        subscriptionId: subscription.id,
        customerEmail: subscription.user.email,
        result,
        nextSteps: getNextSteps(result),
        sliceName: sliceStripe
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Admin handle retry payment',
      sliceName: sliceStripe
    })
  }
}
