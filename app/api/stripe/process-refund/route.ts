import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import prisma from '@/prisma/client'
import createRefundNotificationEmail from '@/app/lib/email-templates/refund-notification'
import { createLog } from '@/app/lib/api/createLog'
import getRefundNextSteps from '@/app/lib/api/getRefundNextSteps'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { sliceStripe } from '@/public/data/api.data'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

const resend = new Resend(process.env.RESEND_API_KEY)

const sliceProcessRefund = 'processRefund'

export async function POST(req: NextRequest) {
  try {
    // Check user authentication and admin permissions
    const userHeader = req.headers.get('x-user')
    if (!userHeader) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing user header', sliceName: sliceProcessRefund },
        { status: 401 }
      )
    }

    const parsedUser = JSON.parse(userHeader)
    if (!parsedUser.isAdmin) {
      return NextResponse.json({ message: 'Forbidden: Admins only', sliceName: sliceProcessRefund }, { status: 403 })
    }

    // Parse request body
    const body = await req.json()
    const { subscriptionId, refundAmount, reason, notifyCustomer = true } = body

    // Validate required fields
    if (!subscriptionId) {
      return NextResponse.json(
        { message: 'Subscription ID is required', sliceName: sliceProcessRefund },
        { status: 400 }
      )
    }

    // Get subscription from database
    const subscription = await prisma.stripeSubscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true }
    })

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription not found', sliceName: sliceProcessRefund }, { status: 404 })
    }

    // Ensure we have required Stripe IDs
    if (!subscription.customerId) {
      return NextResponse.json(
        { message: 'No Stripe customer ID found', sliceName: sliceProcessRefund },
        { status: 400 }
      )
    }

    // Get the most recent successful payment intent for this customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: subscription.customerId,
      limit: 10, // Get more to find the most recent successful one
      expand: ['data.charges']
    })

    // Find the most recent successful payment
    const successfulPayment = paymentIntents.data.find(
      (pi) =>
        pi.status === 'succeeded' && (pi as any).charges?.data?.some((charge: any) => charge.paid && !charge.refunded)
    )

    if (!successfulPayment) {
      return NextResponse.json(
        { message: 'No recent successful payments found to refund', sliceName: sliceProcessRefund },
        { status: 400 }
      )
    }

    // Get the charge to refund
    const chargeToRefund = (successfulPayment as any).charges?.data?.find(
      (charge: any) => charge.paid && !charge.refunded
    )

    if (!chargeToRefund.id) {
      return NextResponse.json(
        { message: 'No valid charge found to refund', sliceName: sliceProcessRefund },
        { status: 400 }
      )
    }

    // Determine refund amount (full refund if not specified)
    const maxRefundAmount = chargeToRefund.amount - (chargeToRefund.amount_refunded || 0)
    const refundAmountCents = refundAmount ? Math.min(refundAmount * 100, maxRefundAmount) : maxRefundAmount

    if (refundAmountCents <= 0) {
      return NextResponse.json(
        { message: 'No amount available to refund or invalid refund amount', sliceName: sliceProcessRefund },
        { status: 400 }
      )
    }

    // Process the refund
    const refund = await stripe.refunds.create({
      charge: chargeToRefund.id,
      amount: refundAmountCents,
      reason: reason || 'requested_by_customer',
      metadata: {
        admin_user_id: parsedUser.id,
        subscription_id: subscription.id,
        refund_type: 'admin_initiated'
      }
    })

    // Prepare refund details for response and logging
    const refundDetails = {
      refundId: refund.id,
      chargeId: chargeToRefund.id,
      paymentIntentId: successfulPayment.id,
      amount: refund.amount / 100, // Convert to dollars
      currency: refund.currency,
      status: refund.status,
      reason: refund.reason,
      receiptNumber: refund.receipt_number
    }

    // Send notification email to customer if requested
    let emailResult = null
    if (notifyCustomer) {
      try {
        emailResult = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'support@yourapp.com',
          to: [subscription.user.email],
          subject: 'Refund Processed - Your Payment Has Been Refunded',
          html: createRefundNotificationEmail(
            subscription.user.email,
            subscription.plan,
            refundDetails.amount,
            refundDetails.receiptNumber || refund.id,
            reason
          )
        })
      } catch (emailError: any) {
        // Log email error but don't fail the refund
        await createLog('warning', `Refund notification email failed: ${emailError.message}`, {
          refundId: refund.id,
          customerEmail: subscription.user.email,
          emailError: emailError.message
        })
      }
    }

    // Update subscription status if this was for current billing cycle
    if (refund.status === 'succeeded') {
      // You might want to update subscription status or add notes
      await prisma.stripeSubscription.update({
        where: { id: subscription.id },
        data: {
          updatedAt: new Date()
          // Add any other fields you want to track refunds
        }
      })
    }

    // Log the refund action for audit purposes
    await createLog('info', `Refund processed by admin ${parsedUser.id}`, {
      adminUserId: parsedUser.id,
      action: 'PROCESS_REFUND',
      targetType: 'SUBSCRIPTION',
      targetId: subscription.id,
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      customerEmail: subscription.user.email,
      refundDetails,
      emailSent: !!emailResult?.data?.id,
      emailId: emailResult?.data?.id || null,
      timestamp: new Date().toISOString()
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Refund processed successfully',
        subscriptionId: subscription.id,
        customerEmail: subscription.user.email,
        refund: refundDetails,
        emailSent: !!emailResult?.data?.id,
        nextSteps: getRefundNextSteps(refund.status, notifyCustomer),
        sliceName: sliceProcessRefund
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Admin process refund',
      sliceName: sliceStripe
    })
  }
}
