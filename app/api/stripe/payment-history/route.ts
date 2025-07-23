import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { sliceStripe } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

export async function GET(req: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const subscriptionId = searchParams.get('subscriptionId')
    const customerId = searchParams.get('customerId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const startingAfter = searchParams.get('startingAfter') // For pagination

    // Validate that we have either subscriptionId or customerId
    if (!subscriptionId && !customerId) {
      return NextResponse.json(
        { message: 'Either subscriptionId or customerId is required', sliceName: sliceStripe },
        { status: 400 }
      )
    }

    let stripeCustomerId = customerId

    // If we have subscriptionId, get the customer ID from our database
    if (subscriptionId && !customerId) {
      const subscription = await prisma.stripeSubscription.findUnique({
        where: { id: subscriptionId },
        include: { user: true }
      })

      if (!subscription) {
        return NextResponse.json({ message: 'Subscription not found', sliceName: sliceStripe }, { status: 404 })
      }

      stripeCustomerId = subscription.customerId
    }

    if (!stripeCustomerId) {
      return NextResponse.json({ message: 'No customer ID found', sliceName: sliceStripe }, { status: 400 })
    }

    // Get payment history from multiple Stripe endpoints
    const [paymentIntents, charges, invoices, refunds] = await Promise.all([
      // Payment Intents (modern payments)
      stripe.paymentIntents.list({
        customer: stripeCustomerId,
        limit: limit,
        ...(startingAfter && { starting_after: startingAfter })
      }),

      // Charges (legacy and current)
      stripe.charges.list({
        customer: stripeCustomerId,
        limit: limit,
        ...(startingAfter && { starting_after: startingAfter })
      }),

      // Invoices
      stripe.invoices.list({
        customer: stripeCustomerId,
        limit: limit,
        ...(startingAfter && { starting_after: startingAfter })
      }),

      // Refunds for this customer
      stripe.refunds.list({
        limit: limit,
        ...(startingAfter && { starting_after: startingAfter })
      })
    ])

    // Filter refunds to only include ones for this customer
    const customerRefunds = refunds.data.filter((refund) => {
      // Get the charge associated with this refund and check if it belongs to our customer
      return charges.data.some((charge) => charge.id === refund.charge && charge.customer === stripeCustomerId)
    })

    // Process and combine all payment data
    const paymentHistory: any = []

    // Add Payment Intents
    paymentIntents.data.forEach((pi) => {
      paymentHistory.push({
        id: pi.id,
        type: 'payment_intent',
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        description: pi.description || 'Payment',
        created: pi.created,
        payment_method_types: pi.payment_method_types,
        receipt_email: pi.receipt_email,
        metadata: pi.metadata,
        failure_message: (pi as any).last_payment_error?.message || null,
        stripe_url: `https://dashboard.stripe.com/payments/${pi.id}`
      })
    })

    // Add Charges (avoid duplicates with payment intents)
    charges.data.forEach((charge) => {
      // Only include charges that aren't already covered by payment intents
      const existingPI = paymentIntents.data.find((pi) =>
        (pi as any).charges?.data?.some((c: any) => c.id === charge.id)
      )

      if (!existingPI) {
        paymentHistory.push({
          id: charge.id,
          type: 'charge',
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          description: charge.description || 'Charge',
          created: charge.created,
          payment_method: charge.payment_method_details?.type,
          receipt_email: charge.receipt_email,
          receipt_url: charge.receipt_url,
          refunded: charge.refunded,
          amount_refunded: charge.amount_refunded,
          failure_message: charge.failure_message,
          metadata: charge.metadata,
          stripe_url: `https://dashboard.stripe.com/payments/${charge.id}`
        })
      }
    })

    // Add Invoices
    invoices.data.forEach((invoice: any) => {
      paymentHistory.push({
        id: invoice.id,
        type: 'invoice',
        amount: invoice.total,
        currency: invoice.currency,
        status: invoice.status,
        description: `Invoice ${invoice.number || invoice.id}`,
        created: invoice.created,
        due_date: invoice.due_date,
        hosted_invoice_url: invoice.hosted_invoice_url,
        invoice_pdf: invoice.invoice_pdf,
        receipt_email: invoice.customer_email,
        subscription_id: invoice.subscription,
        metadata: invoice.metadata,
        stripe_url: `https://dashboard.stripe.com/invoices/${invoice.id}`
      })
    })

    // Add Refunds
    customerRefunds.forEach((refund) => {
      paymentHistory.push({
        id: refund.id,
        type: 'refund',
        amount: -refund.amount, // Negative amount for refunds
        currency: refund.currency,
        status: refund.status,
        description: `Refund for ${refund.charge}`,
        created: refund.created,
        reason: refund.reason,
        receipt_number: refund.receipt_number,
        charge_id: refund.charge,
        metadata: refund.metadata,
        stripe_url: `https://dashboard.stripe.com/payments/${refund.charge}`
      })
    })

    // Sort by creation date (most recent first)
    paymentHistory.sort((a: { created: number }, b: { created: number }) => b.created - a.created)

    // Take only the requested limit after combining and sorting
    const limitedHistory: any = paymentHistory.slice(0, limit)

    // Get customer details for context
    let customerInfo = null
    try {
      const customer = await stripe.customers.retrieve(stripeCustomerId)
      if (customer && !customer.deleted) {
        customerInfo = {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: customer.created,
          default_payment_method: customer.invoice_settings?.default_payment_method
        }
      }
    } catch {
      // Customer might not exist, continue without customer info
    }

    // Calculate summary statistics
    const summary = {
      total_payments: limitedHistory.filter(
        (p: { type: string; status: string }) => p.type !== 'refund' && p.status === 'succeeded'
      ).length,
      total_amount_paid: limitedHistory
        .filter((p: { type: string; status: string }) => p.type !== 'refund' && p.status === 'succeeded')
        .reduce((sum: any, p: { amount: any }) => sum + p.amount, 0),
      total_refunds: limitedHistory.filter((p: { type: string }) => p.type === 'refund').length,
      total_amount_refunded: Math.abs(
        limitedHistory
          .filter((p: { type: string }) => p.type === 'refund')
          .reduce((sum: any, p: { amount: any }) => sum + p.amount, 0)
      ),
      failed_payments: limitedHistory.filter(
        (p: { type: string; status: string }) =>
          (p.type === 'payment_intent' || p.type === 'charge') &&
          (p.status === 'failed' || p.status === 'requires_payment_method')
      ).length,
      currency: limitedHistory[0]?.currency || 'usd'
    }

    // Log the access for audit purposes
    await createLog('info', `Payment history accessed by admin ${parsedUser.id}`, {
      adminUserId: parsedUser.id,
      action: 'VIEW_PAYMENT_HISTORY',
      targetType: 'CUSTOMER',
      targetId: stripeCustomerId,
      subscriptionId: subscriptionId || null,
      recordsReturned: limitedHistory.length,
      timestamp: new Date().toISOString()
    })

    // Return the payment history
    return NextResponse.json(
      {
        success: true,
        customer: customerInfo,
        payment_history: limitedHistory,
        summary,
        pagination: {
          has_more: paymentHistory.length > limit,
          next_starting_after: limitedHistory[limitedHistory.length - 1]?.id
        },
        sliceName: sliceStripe
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Payment history',
      sliceName: sliceStripe
    })
  }
}
