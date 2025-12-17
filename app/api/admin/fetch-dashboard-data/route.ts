import { handleApiError } from '@/app/lib/api/handleApiError'
import { requireAdmin } from '@/app/lib/auth/getServerSession';
import prisma from '@/prisma/client'
import { sliceAdmin } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    // Fetch all data
    const subscriptions = await prisma.stripeSubscription.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    })
    const users = await prisma.user.findMany({
      include: {
        pets: true,
        stripeSubscription: true,
        tokenTransactions: { orderBy: { createdAt: 'desc' } },
        tickets: true
      }
    })
    const pets = await prisma.pet.findMany({
      include: {
        painScores: true,
        medications: true,
        appointments: true,
        feedings: true,
        seizures: true,
        waters: true,
        bloodSugars: true,
        movements: true,
        vitalSigns: true,
        owner: {
          select: {
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            painScores: true,
            appointments: true,
            medications: true,
            feedings: true,
            seizures: true,
            waters: true,
            bloodSugars: true,
            vitalSigns: true,
            galleryItems: true,
            movements: true
          }
        }
      }
    })

    const logs = await prisma.log.findMany({ orderBy: { createdAt: 'desc' } })
    const settings = await prisma.setting.findFirst()
    const tickets = await prisma.ticket.findMany({
      select: {
        id: true,
        category: true,
        priority: true,
        status: true,
        description: true,
        email: true,
        deviceInfo: true,
        attachments: true,
        user: true,
        messages: true
      }
    })

    // 1. Revenue Analytics
    const revenueByMonth: Record<string, number> = {}
    const subscriptionsByMonth: Record<string, number> = {}

    for (const sub of subscriptions) {
      const date = new Date(sub.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!revenueByMonth[key]) revenueByMonth[key] = 0
      if (!subscriptionsByMonth[key]) subscriptionsByMonth[key] = 0

      revenueByMonth[key] += sub.planPrice
      subscriptionsByMonth[key] += 1
    }

    const revenueData = Object.entries(revenueByMonth)
      .map(([month, cents]) => ({
        month,
        revenue: Number((cents / 100).toFixed(2)),
        subscriptions: subscriptionsByMonth[month] || 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // 2. Subscription Plan Distribution
    const planDistribution = subscriptions.reduce(
      (acc, sub) => {
        acc[sub.plan] = (acc[sub.plan] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const planDistributionData = Object.entries(planDistribution).map(([plan, count]) => ({
      plan,
      count,
      percentage: Number(((count / subscriptions.length) * 100).toFixed(1))
    }))

    // 3. Subscription Status Distribution
    const statusDistribution = subscriptions.reduce(
      (acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const statusDistributionData = Object.entries(statusDistribution).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: Number(((count / subscriptions.length) * 100).toFixed(1))
    }))

    // 4. User Growth Over Time
    const userGrowthByMonth: Record<string, number> = {}

    for (const user of users) {
      const date = new Date(user.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      userGrowthByMonth[key] = (userGrowthByMonth[key] || 0) + 1
    }

    let cumulativeUsers = 0
    const userGrowthData = Object.entries(userGrowthByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, newUsers]) => {
        cumulativeUsers += newUsers
        return {
          month,
          newUsers,
          totalUsers: cumulativeUsers
        }
      })

    // 5. User Role Distribution
    const roleDistribution = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const roleDistributionData = Object.entries(roleDistribution).map(([role, count]) => ({
      role,
      count,
      percentage: Number(((count / users.length) * 100).toFixed(1))
    }))

    // 6. Pet Analytics
    const petTypeDistribution = pets.reduce(
      (acc, pet) => {
        acc[pet.type] = (acc[pet.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const petTypeData = Object.entries(petTypeDistribution).map(([type, count]) => ({
      type,
      count,
      percentage: Number(((count / pets.length) * 100).toFixed(1))
    }))

    // 7. Pet Breeds (Top 10)
    const breedDistribution = pets.reduce(
      (acc, pet) => {
        acc[pet.breed] = (acc[pet.breed] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const topBreedsData = Object.entries(breedDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([breed, count]) => ({
        breed,
        count
      }))

    // 8. Pet Age Distribution
    const ageDistribution = pets.reduce(
      (acc, pet) => {
        const ageNum = parseInt(pet.age)
        let ageGroup = 'Unknown'

        if (ageNum <= 1) ageGroup = 'Puppy/Kitten (0-1)'
        else if (ageNum <= 3) ageGroup = 'Young (2-3)'
        else if (ageNum <= 7) ageGroup = 'Adult (4-7)'
        else if (ageNum > 7) ageGroup = 'Senior (8+)'

        acc[ageGroup] = (acc[ageGroup] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const ageDistributionData = Object.entries(ageDistribution).map(([ageGroup, count]) => ({
      ageGroup,
      count,
      percentage: Number(((count / pets.length) * 100).toFixed(1))
    }))

    // 9. Token Usage Analytics
    const tokenStats = users.reduce(
      (acc, user) => {
        acc.totalTokens += user.tokens
        acc.totalTokensUsed += user.tokensUsed
        acc.activeTokenUsers += user.tokensUsed > 0 ? 1 : 0
        return acc
      },
      { totalTokens: 0, totalTokensUsed: 0, activeTokenUsers: 0 }
    )

    const tokenUsageData = [
      { name: 'Available Tokens', value: tokenStats.totalTokens, color: '#374151' },
      { name: 'Used Tokens', value: tokenStats.totalTokensUsed, color: '#6b7280' }
    ]

    // 10. User Activity Metrics
    const userTypes = users.reduce(
      (acc, user) => {
        if (user.isComfortUser) acc.comfortUsers++
        else if (user.isLegacyUser) acc.legacyUsers++
        else if (user.isFreeUser) acc.freeUsers++
        return acc
      },
      {
        freeUsers: 0,
        comfortUsers: 0,
        legacyUsers: 0
      }
    )

    const userTypeData = Object.entries(userTypes).map(([type, count]) => ({
      type: type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
      count,
      percentage: Number(((count / users.length) * 100).toFixed(1))
    }))

    // 11. Payment Method Analytics
    const paymentMethods = subscriptions.reduce(
      (acc, sub) => {
        if (sub.paymentMethod) {
          acc[sub.paymentMethod] = (acc[sub.paymentMethod] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    )

    const paymentMethodData = Object.entries(paymentMethods).map(([method, count]) => ({
      method: method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      count,
      percentage: Number(((count / subscriptions.length) * 100).toFixed(1))
    }))

    // 12. Monthly Active Revenue (MRR) by Plan
    const mrrByPlan = subscriptions
      .filter((sub) => sub.status === 'active')
      .reduce(
        (acc, sub) => {
          acc[sub.plan] = (acc[sub.plan] || 0) + sub.planPrice
          return acc
        },
        {} as Record<string, number>
      )

    const mrrData = Object.entries(mrrByPlan).map(([plan, cents]) => ({
      plan,
      mrr: Number((cents / 100).toFixed(2))
    }))

    // 13. Summary Statistics
    const summaryStats = {
      totalUsers: users.length,
      freeUsers: users.filter((u) => u.isFreeUser).length,
      comfortUsers: users.filter((u) => u.isComfortUser).length,
      lecacyUsers: users.filter((u) => u.isLegacyUser).length,
      totalPets: pets.length,
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter((s) => s.status === 'active').length,
      totalRevenue: Number((subscriptions.reduce((sum, sub) => sum + sub.planPrice, 0) / 100).toFixed(2)),
      averageRevenuePerUser: Number(
        (subscriptions.reduce((sum, sub) => sum + sub.planPrice, 0) / 100 / users.length).toFixed(2)
      ),
      petsPerUser: Number((pets.length / users.length).toFixed(2)),
      tokenUtilizationRate: Number(
        ((tokenStats.totalTokensUsed / (tokenStats.totalTokens + tokenStats.totalTokensUsed)) * 100).toFixed(1)
      )
    }

    return NextResponse.json(
      {
        // Raw data
        subscriptions,
        users,
        pets,
        logs,
        settings,
        tickets,
        // Chart-ready data
        charts: {
          revenueByMonth: revenueData,
          planDistribution: planDistributionData,
          statusDistribution: statusDistributionData,
          userGrowth: userGrowthData,
          roleDistribution: roleDistributionData,
          petTypes: petTypeData,
          topBreeds: topBreedsData,
          petAges: ageDistributionData,
          tokenUsage: tokenUsageData,
          userTypes: userTypeData,
          paymentMethods: paymentMethodData,
          mrrByPlan: mrrData
        },

        // Summary statistics
        summary: summaryStats,

        sliceName: sliceAdmin
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Fetch admin dashboard data',
      sliceName: sliceAdmin
    })
  }
}
