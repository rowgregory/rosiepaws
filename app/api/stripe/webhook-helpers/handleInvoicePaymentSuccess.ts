import { createLog } from '@/app/lib/api/createLog'
import sendPlanChangeEmail from '@/app/lib/resend/sendPlanChangeEmail'
import { createStripeInstance } from '@/app/lib/utils/common/stripe'
import prisma from '@/prisma/client'
import Stripe from 'stripe'

async function handleInvoicePaymentSuccess(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string

  if (!subscriptionId) {
    await createLog('error', 'Invoice payment succeeded but no subscription ID found', {
      location: ['webhook - invoice.payment_succeeded'],
      name: 'InvoicePaymentSucceededNoSubscription',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      invoiceId: invoice.id,
      billingReason: invoice.billing_reason
    })
    return
  }

  const stripe = createStripeInstance()

  const stripeSubscription = await prisma.stripeSubscription.findFirst({
    where: { subscriptionId: subscriptionId }
  })

  if (!stripeSubscription) {
    await createLog('error', 'Subscription payment succeeded but no subscription record found', {
      location: ['webhook - invoice.payment_succeeded'],
      name: 'PaymentSucceededNoSubscription',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      invoiceId: invoice.id
    })
    return
  }

  try {
    // Get full subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer

    // Get current plan from invoice/subscription
    const currentPlanInfo = invoice.lines.data[0]
    const currentPlanName = (currentPlanInfo as any).price?.nickname || 'COMFORT'
    const currentPlanPrice = (currentPlanInfo as any).price?.unit_amount || 0

    // Get previous plan from database
    const previousPlanName = stripeSubscription.plan || 'FREE'
    const previousPlanPrice = stripeSubscription.planPrice || 0

    // Determine if this is a plan change
    const isPlanChange = currentPlanName !== previousPlanName
    let changeType: 'upgrade' | 'downgrade' = 'upgrade'

    if (isPlanChange) {
      changeType = currentPlanPrice > previousPlanPrice ? 'upgrade' : 'downgrade'
    }

    const currentPeriodEnd = (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const updatedSubscription = await prisma.stripeSubscription.update({
      where: { id: stripeSubscription.id },
      data: {
        status: subscription.status,
        currentPeriodEnd,
        subscriptionId: subscriptionId,
        plan: currentPlanName,
        planPrice: currentPlanPrice,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
      },
      include: {
        user: {
          select: { email: true, id: true }
        }
      }
    })

    await createLog('info', 'Subscription payment processed successfully', {
      location: ['webhook - invoice.payment_succeeded'],
      name: 'SubscriptionPaymentSucceeded',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      invoiceId: invoice.id,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      subscriptionStatus: subscription.status,
      userId: stripeSubscription.userId,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
      isPlanChange: isPlanChange,
      previousPlan: previousPlanName,
      newPlan: currentPlanName,
      changeType: changeType
    })

    const emailData = {
      customerEmail: updatedSubscription.user.email || customer.email || '',
      previousPlan: previousPlanName,
      newPlan: currentPlanName,
      planPrice: invoice.amount_paid / 100, // Convert cents to dollars
      transactionId: (invoice as any).payment_intent as string, // Removed (as any)
      nextBillingDate: new Date((subscription as any).current_period_end * 1000).toLocaleDateString(), // Removed (as any)
      changeType: changeType,
      customMessage: isPlanChange
        ? changeType === 'upgrade'
          ? `Welcome to ${currentPlanName}! You now have access to enhanced features.`
          : `Your plan has been updated to ${currentPlanName}. Changes are effective immediately.`
        : `Thank you for your ${currentPlanName} subscription payment!`
    }

    try {
      // Send plan change/payment email
      await sendPlanChangeEmail(emailData)

      await createLog('info', isPlanChange ? 'Plan change email sent' : 'Payment confirmation email sent', {
        location: ['webhook - invoice.payment_succeeded'],
        name: isPlanChange ? 'PlanChangeEmailSent' : 'PaymentEmailSent',
        timestamp: new Date().toISOString(),
        customerId: customerId,
        subscriptionId: subscriptionId,
        userEmail: emailData.customerEmail,
        changeType: changeType,
        isPlanChange: isPlanChange
      })
    } catch (emailError) {
      await createLog('error', 'Failed to send subscription email', {
        location: ['webhook - invoice.payment_succeeded'],
        name: 'SubscriptionEmailFailed',
        timestamp: new Date().toISOString(),
        customerId: customerId,
        subscriptionId: subscriptionId,
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      })
    }
  } catch (error) {
    await createLog('error', 'Error handling invoice payment success', {
      location: ['webhook - invoice.payment_succeeded'],
      name: 'InvoicePaymentSuccessError',
      timestamp: new Date().toISOString(),
      customerId: customerId,
      subscriptionId: subscriptionId,
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })

    // Re-throw so webhook returns 500 and Stripe retries
    throw error
  }
}

export default handleInvoicePaymentSuccess
