import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil' // Make sure to set the appropriate API version
})

// POST /api/stripe/create-customer
export async function POST(req: NextRequest) {
  const { email } = await req.json()

  // Check if user exists in your DB
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    // Create a Stripe customer if they don't exist
    const customer = await stripe.customers.create({ email })

    // Save customer ID in your DB
    await prisma.user.update({
      where: { email },
      data: { stripeCustomerId: customer.id }
    })

    return NextResponse.json({ customerId: customer.id })
  }

  return NextResponse.json({ customerId: user.stripeCustomerId })
}
