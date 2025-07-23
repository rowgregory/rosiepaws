// app/api/admin/send-payment-update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import prisma from '@/prisma/client'
import updatePaymentTemplate from '@/app/lib/email-templates/update-payment-method'
import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { sliceStripe } from '@/public/data/api.data'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})
const resend = new Resend(process.env.RESEND_API_KEY)

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
    const { subscriptionId, customMessage } = body

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

    // Ensure we have required Stripe IDs
    if (!subscription.customerId) {
      return NextResponse.json({ message: 'No Stripe customer ID found', sliceName: sliceStripe }, { status: 400 })
    }

    // Create a Stripe billing portal session for secure payment method updates
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/subscriptions`,
      flow_data: {
        type: 'payment_method_update',
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/subscriptions?updated=true`
          }
        }
      }
    })

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'no-reply@rosiepawsapp.com',
      to: [subscription.user.email],
      subject: 'Update Your Payment Method - Action Required',
      html: updatePaymentTemplate(
        portalSession.url,
        subscription.user.email,
        subscription.plan,
        subscription.planPrice / 100, // Convert cents to dollars
        customMessage
      )
    })

    if (emailResult.error) {
      throw new Error(`Failed to send email: ${emailResult.error.message}`)
    }

    // Update subscription with email sent timestamp
    await prisma.stripeSubscription.update({
      where: { id: subscription.id },
      data: {
        updatedAt: new Date()
      }
    })

    // Log the action for audit purposes
    await createLog('info', `Payment update email sent by admin ${parsedUser.id}`, {
      adminUserId: parsedUser.id,
      action: 'SEND_PAYMENT_UPDATE_EMAIL',
      targetType: 'SUBSCRIPTION',
      targetId: subscription.id,
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      customerEmail: subscription.user.email,
      emailId: emailResult.data?.id,
      portalSessionId: portalSession.id,
      customMessage: customMessage || null,
      timestamp: new Date().toISOString()
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Payment update email sent successfully',
        subscriptionId: subscription.id,
        customerEmail: subscription.user.email,
        emailId: emailResult.data?.id,
        portalUrl: portalSession.url, // For admin reference (don't expose to frontend)
        nextSteps: [
          'Customer will receive an email with a secure link',
          'Link expires in 24 hours for security',
          'Customer can update payment method and billing details',
          'You will be notified when payment method is updated'
        ],
        sliceName: sliceStripe
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Admin update payment method',
      sliceName: sliceStripe
    })
  }
}
