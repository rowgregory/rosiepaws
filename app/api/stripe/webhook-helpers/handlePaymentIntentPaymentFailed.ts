import { createLog } from '@/app/lib/api/createLog'
import sendPaymentIntentPaymentFailedEmail from '@/app/lib/resend/sendPaymentIntentPaymentFailedEmail'

import { createStripeInstance } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const paymentIntentId = paymentIntent.id
  const customerId = paymentIntent.customer as string
  const amountFailed = paymentIntent.amount
  const currency = paymentIntent.currency
  const failureCode = paymentIntent.last_payment_error?.code
  const failureMessage = paymentIntent.last_payment_error?.message

  try {
    // Check if this payment intent is related to a subscription
    const invoiceId = (paymentIntent as any).invoice as string

    if (!invoiceId) {
      // This could be a subscription creation failure or non-subscription payment
      if (
        paymentIntent.description === 'Subscription creation' ||
        paymentIntent.description?.includes('subscription')
      ) {
        // Handle subscription creation failure
        await handleSubscriptionCreationFailure(paymentIntent)
        return
      } else {
        // Not a subscription-related payment, might be one-time purchase
        await createLog('info', 'Payment intent failed for non-subscription payment', {
          location: ['webhook - payment_intent.payment_failed'],
          name: 'NonSubscriptionPaymentIntentFailed',
          timestamp: new Date().toISOString(),
          paymentIntentId: paymentIntentId,
          customerId: customerId,
          amount: amountFailed,
          currency: currency,
          failureCode: failureCode,
          failureMessage: failureMessage,
          description: paymentIntent.description
        })
        return
      }
    }

    const stripe = createStripeInstance()

    // Get the invoice to understand what failed
    const invoice = await stripe.invoices.retrieve(invoiceId)
    const subscriptionId = (invoice as any).subscription as string

    if (!subscriptionId) {
      throw new Error('No subscription found for failed payment intent')
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Find the subscription record and user
    const stripeSubscription = await prisma.stripeSubscription.findFirst({
      where: { subscriptionId: subscriptionId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, role: true }
        }
      }
    })

    if (!stripeSubscription) {
      await createLog('error', 'Payment intent failed but no subscription record found', {
        location: ['webhook - payment_intent.payment_failed'],
        name: 'PaymentIntentFailedNoSubscription',
        timestamp: new Date().toISOString(),
        paymentIntentId: paymentIntentId,
        customerId: customerId,
        subscriptionId: subscriptionId,
        invoiceId: invoiceId,
        amount: amountFailed,
        failureCode: failureCode
      })
      return
    }

    // Determine the type of payment that failed
    const billingReason = invoice.billing_reason
    let failureType = 'unknown'
    let targetPlan = 'Unknown'

    // Get the plan from the invoice line items
    if (invoice.lines.data.length > 0) {
      const lineItem = invoice.lines.data[0]
      targetPlan = (lineItem as any).price?.nickname || lineItem.description || 'Unknown Plan'
    }

    switch (billingReason) {
      case 'subscription_create':
        failureType = 'initial_subscription'
        break
      case 'subscription_update':
        failureType = 'plan_change'
        break
      case 'subscription_cycle':
        failureType = 'billing_cycle'
        break
      default:
        failureType = billingReason || 'unknown'
    }

    // Log the payment intent failure
    await createLog('error', 'Payment intent failed for subscription', {
      location: ['webhook - payment_intent.payment_failed'],
      name: 'SubscriptionPaymentIntentFailed',
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntentId,
      customerId: customerId,
      subscriptionId: subscriptionId,
      invoiceId: invoiceId,
      userId: stripeSubscription.userId,
      userEmail: stripeSubscription.user.email,
      amount: amountFailed,
      currency: currency,
      failureCode: failureCode,
      failureMessage: failureMessage,
      failureType: failureType,
      billingReason: billingReason,
      targetPlan: targetPlan,
      currentPlan: stripeSubscription.plan,
      subscriptionStatus: subscription.status
    })

    // Send appropriate email based on failure type
    try {
      await sendPaymentIntentPaymentFailedEmail({
        customerEmail: stripeSubscription.user.email,
        customerName: stripeSubscription.user.firstName || 'Valued Customer',
        currentPlan: stripeSubscription.plan,
        targetPlan: targetPlan,
        failureType: failureType,
        amountFailed: amountFailed / 100, // Convert cents to dollars
        failureReason: getHumanReadableFailureReason(failureCode, failureMessage),
        billingReason: billingReason || null,
        customMessage: getCustomMessageForFailureType(failureType, targetPlan, stripeSubscription.plan)
      })

      await createLog('info', 'Payment intent failed email sent', {
        location: ['webhook - payment_intent.payment_failed'],
        name: 'PaymentIntentFailedEmailSent',
        timestamp: new Date().toISOString(),
        paymentIntentId: paymentIntentId,
        customerId: customerId,
        subscriptionId: subscriptionId,
        userEmail: stripeSubscription.user.email,
        failureType: failureType,
        targetPlan: targetPlan
      })
    } catch (emailError) {
      await createLog('error', 'Failed to send payment intent failed email', {
        location: ['webhook - payment_intent.payment_failed'],
        name: 'PaymentIntentFailedEmailError',
        timestamp: new Date().toISOString(),
        paymentIntentId: paymentIntentId,
        customerId: customerId,
        subscriptionId: subscriptionId,
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        failureType: failureType
      })
    }
  } catch (error) {
    await createLog('error', 'Error handling payment intent failure', {
      location: ['webhook - payment_intent.payment_failed'],
      name: 'PaymentIntentFailedHandlerError',
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntentId,
      customerId: customerId,
      amount: amountFailed,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })

    // Re-throw so webhook returns 500 and Stripe retries
    throw error
  }
}

function getHumanReadableFailureReason(failureCode?: string, failureMessage?: string): string {
  if (!failureCode) return failureMessage || 'Payment was declined'

  const reasonMap: Record<string, string> = {
    card_declined: 'Your card was declined',
    insufficient_funds: 'Insufficient funds on your card',
    expired_card: 'Your card has expired',
    incorrect_cvc: 'Incorrect security code (CVC)',
    processing_error: 'A processing error occurred',
    lost_card: 'Your card was reported as lost',
    stolen_card: 'Your card was reported as stolen',
    generic_decline: 'Your card was declined'
  }

  return reasonMap[failureCode] || failureMessage || 'Payment was declined'
}

function getCustomMessageForFailureType(failureType: string, targetPlan: string, currentPlan: string): string {
  switch (failureType) {
    case 'initial_subscription':
      return `We couldn't process your payment for the ${targetPlan} subscription. Please try again with a different payment method.`

    case 'plan_change':
      return `We couldn't process the upgrade to ${targetPlan}. You'll remain on your current ${currentPlan} plan. Please try updating your payment method and try again.`

    case 'billing_cycle':
      return `We couldn't process your recurring payment for ${targetPlan}. We'll automatically retry the payment, or you can update your payment method.`

    default:
      return `We encountered an issue processing your payment. Please check your payment method and try again.`
  }
}

async function handleSubscriptionCreationFailure(paymentIntent: Stripe.PaymentIntent) {
  const paymentIntentId = paymentIntent.id
  const customerId = paymentIntent.customer as string
  const amountFailed = paymentIntent.amount
  const failureCode = paymentIntent.last_payment_error?.code
  const failureMessage = paymentIntent.last_payment_error?.message

  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        stripeSubscription: true // Include subscription if it exists
      }
    })

    if (!user) {
      await createLog('error', 'Subscription creation failed but no user found', {
        location: ['webhook - payment_intent.payment_failed'],
        name: 'SubscriptionCreationFailedNoUser',
        timestamp: new Date().toISOString(),
        paymentIntentId: paymentIntentId,
        customerId: customerId,
        amount: amountFailed,
        failureCode: failureCode
      })
      return
    }

    // Determine target plan from amount
    let targetPlan = 'COMFORT'
    if (amountFailed === 2500) {
      // $25.00 = Legacy
      targetPlan = 'LEGACY'
    } else if (amountFailed === 1000) {
      // $10.00 = Comfort
      targetPlan = 'COMFORT'
    }

    // Log the subscription creation failure
    await createLog('error', 'Subscription creation payment failed', {
      location: ['webhook - payment_intent.payment_failed'],
      name: 'SubscriptionCreationPaymentFailed',
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntentId,
      customerId: customerId,
      userId: user.id,
      userEmail: user.email,
      amount: amountFailed,
      currency: paymentIntent.currency,
      failureCode: failureCode,
      failureMessage: failureMessage,
      targetPlan: targetPlan,
      currentPlan: user.stripeSubscription?.plan
    })

    // Send subscription creation failed email
    await sendPaymentIntentPaymentFailedEmail({
      customerEmail: user.email,
      customerName: user.firstName || 'Valued Customer',
      currentPlan: user.role || 'FREE', // Use their current role
      targetPlan: targetPlan,
      failureType: 'initial_subscription',
      amountFailed: amountFailed / 100,
      failureReason: getHumanReadableFailureReason(failureCode, failureMessage),
      billingReason: 'subscription_create',
      customMessage: `We couldn't process your ${targetPlan} subscription. You'll remain on your current plan until payment is successful.`
    })

    await createLog('info', 'Subscription creation failed email sent', {
      location: ['webhook - payment_intent.payment_failed'],
      name: 'SubscriptionCreationFailedEmailSent',
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntentId,
      customerId: customerId,
      userEmail: user.email,
      targetPlan: targetPlan
    })
  } catch (error) {
    await createLog('error', 'Error handling subscription creation failure', {
      location: ['webhook - payment_intent.payment_failed'],
      name: 'SubscriptionCreationFailureError',
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntentId,
      customerId: customerId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export default handlePaymentIntentFailed
