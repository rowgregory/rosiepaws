// api/cron/reset-tokens.js
import { handleApiError } from '@/app/lib/api/handleApiError'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    console.log('Starting daily token reset for comfort users...')

    const now = new Date()

    // Find all users with comfort role, isComfortUser = true, and valid subscription
    const comfortUsers = await prisma.user.findMany({
      where: {
        role: 'comfort',
        isComfortUser: true
      },
      include: {
        stripeSubscription: true // Include subscription data
      }
    })

    console.log(`Found ${comfortUsers.length} potential comfort users to check`)

    // Filter users who should get token reset based on subscription status
    const eligibleUsers = comfortUsers.filter((user) => {
      const subscription = user.stripeSubscription

      // No subscription = no token reset
      if (!subscription) {
        console.log(`User ${user.email} has no subscription - skipping`)
        return false
      }

      // Check if subscription is active
      if (subscription.status !== 'active') {
        console.log(`User ${user.email} subscription status is '${subscription.status}' - skipping`)
        return false
      }

      // Check if subscription has expired (currentPeriodEnd)
      if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < now) {
        console.log(`User ${user.email} subscription expired on ${subscription.currentPeriodEnd} - skipping`)
        return false
      }

      // Check if subscription is set to cancel at period end and has been canceled
      if (subscription.cancelAtPeriodEnd && subscription.canceledAt) {
        console.log(`User ${user.email} subscription is canceled and will end at period end - skipping`)
        return false
      }

      // Check if user is still in trial period (optional - you might want to include or exclude trial users)
      if (subscription.trialEndsAt && subscription.trialEndsAt > now) {
        console.log(`User ${user.email} is still in trial period until ${subscription.trialEndsAt} - including`)
        return true
      }

      console.log(`User ${user.email} has valid active subscription - including`)
      return true
    })

    console.log(`${eligibleUsers.length} users are eligible for token reset`)

    if (eligibleUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No eligible users found for token reset',
        timestamp: new Date().toISOString(),
        checkedUsers: comfortUsers.length,
        eligibleUsers: 0
      })
    }

    // Extract user IDs for batch update
    const eligibleUserIds = eligibleUsers.map((user) => user.id)

    // Update tokens to 12000 for eligible comfort users
    const updateResult = await prisma.user.updateMany({
      where: {
        id: {
          in: eligibleUserIds
        }
      },
      data: {
        tokens: 12000
      }
    })

    console.log(`Successfully updated ${updateResult.count} users`)

    // Log the update for monitoring
    const updatedUsers = eligibleUsers.map((user) => ({
      id: user.id,
      email: user.email,
      previousTokens: user.tokens,
      newTokens: 12000,
      subscriptionStatus: user.stripeSubscription?.status,
      subscriptionPlan: user.stripeSubscription?.plan,
      currentPeriodEnd: user.stripeSubscription?.currentPeriodEnd
    }))

    return NextResponse.json({
      success: true,
      message: `Reset tokens for ${updateResult.count} comfort users`,
      timestamp: new Date().toISOString(),
      checkedUsers: comfortUsers.length,
      eligibleUsers: eligibleUsers.length,
      updatedUsers: updatedUsers
    })
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Reset comfort tokens',
      sliceName: 'cronApi'
    })
  } finally {
    await prisma.$disconnect()
  }
}
