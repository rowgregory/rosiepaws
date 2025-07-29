import { parseFraction } from '../../common/math'

export interface HealthMetrics {
  feedings: any[]
  painScores: any[]
  waters: any[]
  walks: any[]
  petType?: string
  petAge?: number
  petWeight?: string
}

interface HealthStatus {
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical'
  color: string
  score: number
  insights: string[]
  recommendations: string[]
}

// Helper function to parse weight and convert to pounds
const parseWeightToPounds = (weight: string | number): number => {
  if (typeof weight === 'number') {
    return weight // Assume it's already in pounds
  }

  const weightStr = weight.toString().toLowerCase().trim()

  // Extract numeric value by removing all non-numeric characters except decimal point
  const numericMatch = weightStr.match(/[\d.]+/)

  if (!numericMatch) {
    return 50 // Default fallback if no number found
  }

  const numericValue = parseFloat(numericMatch[0])

  if (isNaN(numericValue)) {
    return 50 // Default fallback
  }

  if (weightStr.includes('oz')) {
    return numericValue / 16 // Convert ounces to pounds
  } else if (weightStr.includes('kg')) {
    return numericValue * 2.20462 // Convert kg to pounds
  } else if (weightStr.includes('g') && !weightStr.includes('kg')) {
    return numericValue * 0.00220462 // Convert grams to pounds
  } else {
    // Assume pounds if no unit specified or "lbs"/"lb" found
    return numericValue
  }
}

export const calculateHealthStatus = (metrics: HealthMetrics): HealthStatus => {
  const { feedings, painScores, waters, walks, petType = 'dog', petAge = 5, petWeight = 50 } = metrics

  const weightInPounds = parseWeightToPounds(petWeight)

  // Get data from last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Filter recent data
  const recentFeedings = feedings?.filter((f) => new Date(f.createdAt) >= sevenDaysAgo) || []
  const recentPainScores = painScores?.filter((p) => new Date(p.createdAt) >= sevenDaysAgo) || []
  const recentWater = waters?.filter((w) => new Date(w.createdAt) >= sevenDaysAgo) || []
  const recentWalks = walks?.filter((w) => new Date(w.createdAt) >= sevenDaysAgo) || []

  let totalScore = 0
  let maxScore = 0
  const insights: string[] = []
  const recommendations: string[] = []

  // 1. FEEDING ASSESSMENT (25 points)
  maxScore += 25
  if (recentFeedings.length === 0) {
    insights.push('No feeding data recorded recently')
    recommendations.push('Start tracking daily meals')
  } else {
    const avgFeedingsPerDay = recentFeedings.length / 7
    const idealFeedings = petType === 'cat' ? 2 : petAge > 8 ? 3 : 2 // Senior pets eat more frequently

    // Calculate total daily food amount
    const totalFoodAmount = recentFeedings.reduce((sum, f) => sum + parseFraction(f.amount), 0)
    const avgFoodPerDay = totalFoodAmount / 7

    // Ideal daily food amount (rough guidelines in cups)
    const idealDailyAmount =
      weightInPounds <= 10
        ? 0.75
        : weightInPounds <= 25
          ? 1.5
          : weightInPounds <= 50
            ? 2.5
            : weightInPounds <= 75
              ? 3.5
              : 4.5

    // Score based on both frequency and amount
    const frequencyScore = Math.min(avgFeedingsPerDay / idealFeedings, 1) * 0.6
    const amountScore = Math.min(avgFoodPerDay / idealDailyAmount, 1) * 0.4
    const combinedScore = frequencyScore + amountScore

    if (combinedScore >= 0.8) {
      totalScore += 25
      insights.push(
        `Good feeding routine (${avgFeedingsPerDay.toFixed(1)} meals/day, ${avgFoodPerDay.toFixed(1)} cups/day)`
      )
    } else if (combinedScore >= 0.6) {
      totalScore += 18
      insights.push(`Decent feeding schedule (${avgFeedingsPerDay.toFixed(1)} meals/day)`)
      if (avgFoodPerDay < idealDailyAmount * 0.7) {
        recommendations.push('Consider increasing food portions')
      } else if (avgFeedingsPerDay < idealFeedings * 0.7) {
        recommendations.push('Try to maintain more regular meal times')
      }
    } else if (combinedScore >= 0.4) {
      totalScore += 10
      insights.push('Feeding schedule could be more consistent')
      recommendations.push('Establish regular meal times and portions')
    } else {
      totalScore += 5
      insights.push('Irregular feeding pattern detected')
      recommendations.push('Consult vet about proper feeding schedule and portions')
    }
  }

  // 2. PAIN ASSESSMENT (30 points)
  maxScore += 30
  if (recentPainScores.length === 0) {
    totalScore += 20 // Assume good if no pain reported
    insights.push('No pain reported recently')
  } else {
    const avgPainScore = recentPainScores.reduce((sum, p) => sum + p.score, 0) / recentPainScores.length
    const trendingUp =
      recentPainScores.length > 1 && recentPainScores[recentPainScores.length - 1].score > recentPainScores[0].score

    if (avgPainScore <= 2) {
      totalScore += 30
      insights.push(`Low pain levels (avg: ${avgPainScore.toFixed(1)}/10)`)
    } else if (avgPainScore <= 4) {
      totalScore += 20
      insights.push(`Mild pain detected (avg: ${avgPainScore.toFixed(1)}/10)`)
      recommendations.push('Monitor pain levels and consult vet if persistent')
    } else if (avgPainScore <= 6) {
      totalScore += 10
      insights.push(`Moderate pain levels (avg: ${avgPainScore.toFixed(1)}/10)`)
      recommendations.push('Consider veterinary consultation for pain management')
    } else {
      totalScore += 0
      insights.push(`High pain levels detected (avg: ${avgPainScore.toFixed(1)}/10)`)
      recommendations.push('Urgent: Schedule veterinary appointment for pain assessment')
    }

    if (trendingUp) {
      totalScore -= 5
      insights.push('Pain levels appear to be increasing')
      recommendations.push('Monitor closely and consider vet visit')
    }
  }

  // 3. HYDRATION ASSESSMENT (20 points)
  maxScore += 20
  if (recentWater.length === 0) {
    insights.push('No water intake data recorded')
    recommendations.push('Track daily water consumption')
  } else {
    const totalWater = recentWater.reduce((sum, w) => sum + parseFloat(w.milliliters || '0'), 0)

    // Convert total water from mL to cups (1 cup = 236.588 mL)
    const totalWaterCups = totalWater / 236.588
    const avgWaterPerDay = totalWaterCups

    // Rough guideline: 1 oz per pound of body weight per day
    const idealWaterOz = weightInPounds * 1
    const idealWaterCups = idealWaterOz / 8 // Convert to cups

    if (avgWaterPerDay >= idealWaterCups * 0.8) {
      totalScore += 20
      insights.push(`Good hydration (${avgWaterPerDay.toFixed(1)} cups/day)`)
    } else if (avgWaterPerDay >= idealWaterCups * 0.6) {
      totalScore += 12
      insights.push('Adequate hydration but could improve')
      recommendations.push('Encourage more water intake')
    } else {
      totalScore += 5
      insights.push('Low water intake detected')
      recommendations.push('Increase water availability and monitor intake')
    }
  }

  // 4. EXERCISE ASSESSMENT (25 points)
  maxScore += 25
  if (recentWalks.length === 0) {
    insights.push('No exercise data recorded recently')
    recommendations.push('Start tracking daily walks and exercise')
  } else {
    const avgWalksPerDay = recentWalks.length / 7
    const totalDuration = recentWalks.reduce((sum, w) => sum + (w.duration || 0), 0)
    const avgDurationPerDay = totalDuration / 7

    // Age-adjusted exercise needs
    const idealWalks = petAge > 10 ? 2 : petAge > 7 ? 2.5 : 3
    const idealDuration = petAge > 10 ? 20 : petAge > 7 ? 30 : 45 // minutes per day

    const walkScore = (avgWalksPerDay / idealWalks) * 0.6 + (avgDurationPerDay / idealDuration) * 0.4

    if (walkScore >= 0.8) {
      totalScore += 25
      insights.push(
        `Active lifestyle (${avgWalksPerDay.toFixed(1)} walks/day, ${avgDurationPerDay.toFixed(0)} min/day)`
      )
    } else if (walkScore >= 0.6) {
      totalScore += 18
      insights.push('Good exercise routine with room for improvement')
      recommendations.push('Consider adding more regular exercise')
    } else if (walkScore >= 0.3) {
      totalScore += 10
      insights.push('Limited exercise activity')
      recommendations.push('Increase daily walks and playtime')
    } else {
      totalScore += 3
      insights.push('Very low exercise activity')
      recommendations.push('Establish a regular exercise routine')
    }
  }

  // Calculate percentage and determine status
  const percentage = (totalScore / maxScore) * 100

  let status: HealthStatus['status']
  let color: string

  if (percentage >= 90) {
    status = 'Excellent'
    color = 'text-emerald-600'
  } else if (percentage >= 75) {
    status = 'Good'
    color = 'text-green-600'
  } else if (percentage >= 60) {
    status = 'Fair'
    color = 'text-yellow-600'
  } else if (percentage >= 40) {
    status = 'Poor'
    color = 'text-orange-600'
  } else {
    status = 'Critical'
    color = 'text-red-600'
  }

  // Add general recommendations based on overall score
  if (percentage < 75) {
    recommendations.push('Consider scheduling a wellness check with your veterinarian')
  }

  if (insights.length === 0) {
    insights.push('Start tracking daily activities to get health insights')
  }

  return {
    status,
    color,
    score: Math.round(percentage),
    insights: insights.slice(0, 3), // Limit to top 3 insights
    recommendations: recommendations.slice(0, 3) // Limit to top 3 recommendations
  }
}
