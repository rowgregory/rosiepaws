import { createLog } from '@/app/lib/utils/logHelper'
import prisma from '@/prisma/client'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

// POST /api/stripe/create-customer
export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, password, packageChosen, securityAnswerHash, securityQuestion } =
      await req.json()

    // Check if user exists in your DB
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Create user in your DB first
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password,
          role: 'guardian',
          securityAnswerHash,
          securityQuestion,
          ...(packageChosen === 'basic' && { isBasicUser: true }),
          ...(packageChosen === 'premium' && { isPremiumUser: true })
        }
      })
    }

    // If user doesn't have a Stripe customer ID, create one
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({ email })

      // Update user with Stripe customer ID
      user = await prisma.user.update({
        where: { email },
        data: { stripeCustomerId: customer.id }
      })
    }

    return NextResponse.json({ customerId: user.stripeCustomerId })
  } catch (error: any) {
    await createLog('error', `Fail to send medication reminder email: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
  }
}
