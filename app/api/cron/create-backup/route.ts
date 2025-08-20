import { getUserFromHeader } from '@/app/lib/api/getUserFromheader'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { sendBackupEmail } from '@/app/lib/resend/sendBackupData'
import prisma from '@/prisma/client'
import { sliceAdmin } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

// Generate complete backup data
async function generateBackupData() {
  const backupData = {
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      environment: process.env.NODE_ENV
    },
    users: await prisma.user.findMany({
      include: {
        accounts: true,
        pets: true,
        tickets: true,
        tokenTransactions: true
      }
    }),
    pets: await prisma.pet.findMany({
      include: {
        painScores: true,
        feedings: true,
        waters: true,
        vitalSigns: true,
        movements: true,
        appointments: true,
        medications: true,
        bloodSugars: true,
        seizures: true
      }
    }),
    tickets: await prisma.ticket.findMany({
      include: {
        messages: true,
        user: true
      }
    }),
    logs: await prisma.log.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days only
        }
      }
    }),
    settings: await prisma.setting.findMany(),
    // Add other tables as needed
    tokenTransactions: await prisma.tokenTransaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }),
    subscriptions: await prisma.stripeSubscription.findMany(),
    galleryItems: await prisma.galleryItem.findMany(),
    newsletters: await prisma.newsletter.findMany()
  }

  return backupData
}

export async function GET(req: NextRequest) {
  try {
    const userAuth = getUserFromHeader({
      req
    })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const backupData = await generateBackupData()

    const adminEmails = [
      // process.env.JACI_EMAIL || 'info@rosiepawsapp.com',
      process.env.SUPER_USER || 'sqysh@sqysh.io'
    ].filter((email) => email)

    // Email the backup file
    await sendBackupEmail(backupData, adminEmails, req, userAuth?.userId)

    return NextResponse.json(
      {
        success: true
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Send backup data',
      sliceName: sliceAdmin
    })
  } finally {
    await prisma.$disconnect()
  }
}
