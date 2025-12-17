import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { createLog } from '@/app/lib/api/createLog'
import { sliceAdmin } from '@/public/data/api.data'
import { requireAdmin } from '@/app/lib/auth/getServerSession'

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const id = session.user.id;
    const { userId, amount, reason } = await req.json()

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required'
        },
        { status: 400 }
      )
    }

    // Validate required fields
    if (typeof amount !== 'number' || amount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid amount is required (positive or negative number)'
        },
        { status: 400 }
      )
    }

    if (!reason?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reason is required'
        },
        { status: 400 }
      )
    }

    // Get admin user details
    const adminUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin user not found'
        },
        { status: 404 }
      )
    }

    // Check if admin user is super user
    const isStaff = adminUser.email === process.env.SUPER_USER

    if (!isStaff) {
      await createLog('warn', 'Unauthorized token update attempt', {
        location: ['api route - PATCH /api/admin/users/[userId]/tokens'],
        name: 'UnauthorizedTokenUpdate',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        adminUserId: id,
        adminEmail: adminUser.email,
        targetUserId: userId,
        attemptedAmount: amount
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Access denied',
          message: 'Only administrators can update user tokens',
          sliceName: sliceAdmin
        },
        { status: 403 }
      )
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        tokens: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'The user you are trying to update does not exist'
        },
        { status: 404 }
      )
    }

    // Check if removing more tokens than user has
    if (amount < 0 && Math.abs(amount) > targetUser.tokens) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient tokens',
          message: `Cannot remove ${Math.abs(amount)} tokens. User only has ${targetUser.tokens} tokens.`
        },
        { status: 400 }
      )
    }

    const previousTokens = targetUser.tokens
    const newTokenBalance = previousTokens + amount

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update user tokens
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          tokens: newTokenBalance
        },
        select: {
          id: true,
          email: true,
          name: true,
          tokens: true,
          tokensUsed: true
        }
      })

      // Create token transaction record
      const tokenTransaction = await tx.tokenTransaction.create({
        data: {
          userId: userId,
          amount: amount,
          type: 'ADMIN_ADJUSTMENT',
          description: `Manual token ${amount > 0 ? 'addition' : 'removal'} by admin`,
          metadata: {
            reason: reason.trim(),
            adminUserId: adminUser.id,
            adminEmail: adminUser.email,
            adminName: adminUser.name,
            previousBalance: previousTokens,
            newBalance: newTokenBalance,
            adjustmentType: amount > 0 ? 'credit' : 'debit',
            timestamp: new Date().toISOString()
          }
        }
      })

      return { updatedUser, tokenTransaction }
    })

    await createLog('info', 'User tokens updated successfully', {
      location: ['api route - PATCH /api/admin/update-user-tokens'],
      name: 'UserTokensUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      adminUserId: id,
      adminEmail: adminUser.email,
      targetUserId: userId,
      targetUserEmail: targetUser.email,
      previousTokens,
      newTokenBalance,
      adjustmentAmount: amount,
      reason: reason.trim(),
      transactionId: result.tokenTransaction.id
    })

    return NextResponse.json(
      {
        message: `Successfully ${amount > 0 ? 'added' : 'removed'} ${Math.abs(amount)} tokens`,
        user: result.updatedUser,
        transaction: result.tokenTransaction,
        previousBalance: previousTokens,
        newTokenBalance: newTokenBalance,
        adjustmentAmount: amount
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Update user tokens',
      sliceName: sliceAdmin
    })
  }
}
