// Native JavaScript date utilities
const formatDate = (date: Date, formatString: string = 'yyyy-MM-dd HH:mm:ss'): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  if (formatString === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`
  }
  if (formatString === 'MMM dd') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${day}`
  }
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const differenceInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date1.getTime() - date2.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const startOfWeek = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

const endOfWeek = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + 6
  return new Date(d.setDate(diff))
}

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

interface SeizureData {
  id: string
  timeRecorded: string | Date
  duration: number // in seconds
  notes?: string
  videoUrl?: string
  videoFilename?: string
  seizureType: 'GENERALIZED' | 'FOCAL' | 'ABSENCE' | 'MYOCLONIC' | 'TONIC_CLONIC' | 'ATONIC' | 'UNKNOWN'
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
  triggerFactor?: string
  recoveryTime?: number // in minutes
  pet: {
    id: string
    name: string
    breed?: string
    type: string
    age?: number
  }
  createdAt: string | Date
}

interface SeizureReportOptions {
  dateRange?: 'week' | 'month' | 'quarter' | 'year' | 'all'
  startDate?: Date
  endDate?: Date
  petId?: string
  includeCharts?: boolean
  format?: 'detailed' | 'summary' | 'veterinary'
}

export const generateSeizureReport = (
  seizureData: SeizureData[],
  options: SeizureReportOptions = {}
): SeizureReport => {
  const { dateRange = 'month', startDate, endDate, petId, format = 'detailed' } = options

  // Filter data based on options
  let filteredData = [...seizureData]

  // Filter by pet if specified
  if (petId) {
    filteredData = filteredData.filter((seizure) => seizure.pet.id === petId)
  }

  // Filter by date range
  if (startDate && endDate) {
    filteredData = filteredData.filter((seizure) => {
      const seizureDate = new Date(seizure.timeRecorded)
      return seizureDate >= startDate && seizureDate <= endDate
    })
  } else {
    const now = new Date()
    let rangeStart: Date
    let rangeEnd: Date = now

    switch (dateRange) {
      case 'week':
        rangeStart = startOfWeek(now)
        rangeEnd = endOfWeek(now)
        break
      case 'month':
        rangeStart = startOfMonth(now)
        rangeEnd = endOfMonth(now)
        break
      case 'quarter':
        rangeStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        break
      case 'year':
        rangeStart = new Date(now.getFullYear(), 0, 1)
        break
      default:
        rangeStart = new Date(0) // Beginning of time
    }

    if (dateRange !== 'all') {
      filteredData = filteredData.filter((seizure) => {
        const seizureDate = new Date(seizure.timeRecorded)
        return seizureDate >= rangeStart && seizureDate <= rangeEnd
      })
    }
  }

  // Sort by date (most recent first)
  filteredData.sort((a, b) => new Date(b.timeRecorded).getTime() - new Date(a.timeRecorded).getTime())

  // Generate comprehensive analysis
  const analysis = analyzeSeizureData(filteredData)

  // Generate report based on format
  switch (format) {
    case 'summary':
      return generateSummaryReport(filteredData, analysis, options)
    case 'veterinary':
      return generateVeterinaryReport(filteredData, analysis, options)
    default:
      return generateDetailedReport(filteredData, analysis, options)
  }
}

const analyzeSeizureData = (data: SeizureData[]) => {
  if (data.length === 0) {
    return {
      totalSeizures: 0,
      averageFrequency: 0,
      averageDuration: 0,
      longestDuration: 0,
      shortestDuration: 0,
      typeDistribution: {},
      severityDistribution: {},
      triggerAnalysis: {},
      recoveryAnalysis: {},
      trends: {},
      riskFactors: [],
      recommendations: []
    }
  }

  // Basic statistics
  const totalSeizures = data.length
  const durations = data.map((s) => s.duration).filter((d) => d > 0)
  const averageDuration = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0
  const longestDuration = durations.length > 0 ? Math.max(...durations) : 0
  const shortestDuration = durations.length > 0 ? Math.min(...durations) : 0

  // Frequency analysis
  const dateRange =
    data.length > 1 ? differenceInDays(new Date(data[0].timeRecorded), new Date(data[data.length - 1].timeRecorded)) : 0
  const averageFrequency = dateRange > 0 ? totalSeizures / (dateRange / 7) : 0 // seizures per week

  // Type distribution
  const typeDistribution = data.reduce(
    (acc, seizure) => {
      acc[seizure.seizureType] = (acc[seizure.seizureType] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Severity distribution
  const severityDistribution = data.reduce(
    (acc, seizure) => {
      acc[seizure.severity] = (acc[seizure.severity] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Trigger analysis
  const triggerAnalysis = data
    .filter((s) => s.triggerFactor && s.triggerFactor !== 'Unknown' && s.triggerFactor !== 'None identified')
    .reduce(
      (acc, seizure) => {
        const trigger = seizure.triggerFactor!
        acc[trigger] = (acc[trigger] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

  // Recovery time analysis
  const recoveryTimes = data.map((s) => s.recoveryTime).filter((t) => t !== undefined && t !== null) as number[]
  const recoveryAnalysis = {
    average: recoveryTimes.length > 0 ? recoveryTimes.reduce((sum, t) => sum + t, 0) / recoveryTimes.length : 0,
    longest: recoveryTimes.length > 0 ? Math.max(...recoveryTimes) : 0,
    shortest: recoveryTimes.length > 0 ? Math.min(...recoveryTimes) : 0
  }

  // Trend analysis (last 30 days vs previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentSeizures = data.filter((s) => new Date(s.timeRecorded) >= thirtyDaysAgo)
  const previousSeizures = data.filter((s) => {
    const date = new Date(s.timeRecorded)
    return date >= sixtyDaysAgo && date < thirtyDaysAgo
  })

  const trends = {
    frequencyChange: recentSeizures.length - previousSeizures.length,
    severityChange: calculateSeverityTrend(recentSeizures, previousSeizures),
    durationChange: calculateDurationTrend(recentSeizures, previousSeizures)
  }

  // Risk factors and recommendations
  const riskFactors = identifyRiskFactors(data, {
    averageFrequency,
    averageDuration: averageDuration / 60,
    trends,
    severityDistribution
  })
  const recommendations = generateRecommendations(data, {
    averageFrequency,
    averageDuration: averageDuration / 60,
    triggerAnalysis,
    severityDistribution,
    trends
  })

  return {
    totalSeizures,
    averageFrequency,
    averageDuration: averageDuration / 60, // convert to minutes
    longestDuration: longestDuration / 60,
    shortestDuration: shortestDuration / 60,
    typeDistribution,
    severityDistribution,
    triggerAnalysis,
    recoveryAnalysis,
    trends,
    riskFactors,
    recommendations
  }
}

const calculateSeverityTrend = (recent: SeizureData[], previous: SeizureData[]) => {
  const severityScore = (severity: string) => {
    switch (severity) {
      case 'MILD':
        return 1
      case 'MODERATE':
        return 2
      case 'SEVERE':
        return 3
      case 'CRITICAL':
        return 4
      default:
        return 0
    }
  }

  const recentAvg =
    recent.length > 0 ? recent.reduce((sum, s) => sum + severityScore(s.severity), 0) / recent.length : 0
  const previousAvg =
    previous.length > 0 ? previous.reduce((sum, s) => sum + severityScore(s.severity), 0) / previous.length : 0

  return recentAvg - previousAvg
}

const calculateDurationTrend = (recent: SeizureData[], previous: SeizureData[]) => {
  const recentAvg = recent.length > 0 ? recent.reduce((sum, s) => sum + s.duration, 0) / recent.length : 0
  const previousAvg = previous.length > 0 ? previous.reduce((sum, s) => sum + s.duration, 0) / previous.length : 0

  return (recentAvg - previousAvg) / 60 // convert to minutes
}

const identifyRiskFactors = (data: SeizureData[], analysisData: any): string[] => {
  const riskFactors: string[] = []

  // High frequency
  if (analysisData.averageFrequency > 1) {
    riskFactors.push('High seizure frequency (>1 per week)')
  }

  // Long duration seizures
  if (analysisData.averageDuration > 2) {
    riskFactors.push('Extended seizure duration (>2 minutes average)')
  }

  // Status epilepticus episodes
  const statusEpilepticusCount = data.filter((s) => s.duration >= 300).length // 5+ minutes
  if (statusEpilepticusCount > 0) {
    riskFactors.push(`${statusEpilepticusCount} episode(s) of status epilepticus`)
  }

  // High severity seizures
  const severeCount = data.filter((s) => s.severity === 'SEVERE' || s.severity === 'CRITICAL').length
  if (severeCount / data.length > 0.3) {
    riskFactors.push('High proportion of severe/critical seizures')
  }

  // Increasing trend
  if (analysisData.trends.frequencyChange > 0) {
    riskFactors.push('Increasing seizure frequency trend')
  }

  // Cluster seizures (multiple seizures in 24 hours)
  const clusters = findSeizureClusters(data)
  if (clusters.length > 0) {
    riskFactors.push(`${clusters.length} cluster seizure event(s)`)
  }

  return riskFactors
}

const findSeizureClusters = (data: SeizureData[]): Date[] => {
  const clusters: Date[] = []
  const sortedData = [...data].sort((a, b) => new Date(a.timeRecorded).getTime() - new Date(b.timeRecorded).getTime())

  for (let i = 0; i < sortedData.length - 1; i++) {
    const current = new Date(sortedData[i].timeRecorded)
    const next = new Date(sortedData[i + 1].timeRecorded)

    if (differenceInDays(next, current) <= 1) {
      clusters.push(current)
    }
  }

  return clusters
}

const generateRecommendations = (data: SeizureData[], analysisData: any): string[] => {
  const recommendations: string[] = []

  // Based on frequency
  if (analysisData.averageFrequency > 1) {
    recommendations.push('Schedule immediate veterinary consultation for medication review')
  } else if (analysisData.averageFrequency > 0.5) {
    recommendations.push('Consider veterinary follow-up within 2 weeks')
  }

  // Based on duration
  if (analysisData.averageDuration > 2) {
    recommendations.push('Discuss rescue medication protocols with veterinarian')
  }

  // Based on triggers
  const commonTriggers = Object.entries(analysisData.triggerAnalysis)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 3)
    .map(([trigger]) => trigger)

  if (commonTriggers.length > 0) {
    recommendations.push(`Focus on avoiding identified triggers: ${commonTriggers.join(', ')}`)
  }

  // Based on severity
  if (analysisData.severityDistribution.CRITICAL > 0) {
    recommendations.push('Develop emergency action plan with veterinarian')
  }

  // Based on trends
  if (analysisData.trends.frequencyChange > 0) {
    recommendations.push('Monitor closely - seizure frequency is increasing')
  }

  // General recommendations
  if (data.length > 0) {
    recommendations.push('Continue detailed seizure logging for veterinary review')
    recommendations.push('Ensure pet has identification with emergency contact information')

    if (data.some((s) => !s.videoUrl)) {
      recommendations.push('Consider recording future seizures when safe to do so')
    }
  }

  return recommendations
}

interface SeizureReport {
  reportDate: string
  petName: string
  reportPeriod: string
  summary: {
    totalSeizures: number
    averageFrequency: number
    averageDuration: number
    mostCommonType: string
    mostCommonSeverity: string
  }
  analysis: any
  seizureLog: SeizureData[]
  riskAssessment: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  recommendations: string[]
  chartData?: any
}

const generateDetailedReport = (data: SeizureData[], analysis: any, options: SeizureReportOptions): SeizureReport => {
  const petName = data.length > 0 ? data[0].pet.name : 'Multiple Pets'
  const mostCommonType =
    Object.entries(analysis.typeDistribution).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'None'
  const mostCommonSeverity =
    Object.entries(analysis.severityDistribution).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] ||
    'None'

  // Risk assessment
  let riskAssessment: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW'

  if (analysis.riskFactors.length === 0) {
    riskAssessment = 'LOW'
  } else if (analysis.riskFactors.length <= 2) {
    riskAssessment = 'MODERATE'
  } else if (analysis.riskFactors.length <= 4) {
    riskAssessment = 'HIGH'
  } else {
    riskAssessment = 'CRITICAL'
  }

  // Chart data for visualization
  const chartData = {
    frequencyOverTime: generateFrequencyChart(data),
    typeDistribution: analysis.typeDistribution,
    severityDistribution: analysis.severityDistribution,
    triggerFrequency: analysis.triggerAnalysis,
    durationTrends: generateDurationChart(data)
  }

  return {
    reportDate: formatDate(new Date()),
    petName,
    reportPeriod: `${options.dateRange || 'month'} period`,
    summary: {
      totalSeizures: analysis.totalSeizures,
      averageFrequency: analysis.averageFrequency,
      averageDuration: analysis.averageDuration,
      mostCommonType,
      mostCommonSeverity
    },
    analysis,
    seizureLog: data,
    riskAssessment,
    recommendations: analysis.recommendations,
    chartData
  }
}

const generateSummaryReport = (data: SeizureData[], analysis: any, options: SeizureReportOptions): SeizureReport => {
  // Simplified version of detailed report
  const detailed = generateDetailedReport(data, analysis, options)
  return {
    ...detailed,
    seizureLog: data.slice(0, 5), // Only show last 5 seizures
    analysis: {
      totalSeizures: analysis.totalSeizures,
      averageFrequency: analysis.averageFrequency,
      trends: analysis.trends
    }
  }
}

const generateVeterinaryReport = (data: SeizureData[], analysis: any, options: SeizureReportOptions): SeizureReport => {
  // Medical-focused version with clinical terminology
  const detailed = generateDetailedReport(data, analysis, options)

  // Add veterinary-specific analysis
  const veterinaryAnalysis = {
    ...analysis,
    clinicalAssessment: {
      seizurePattern: classifySeizurePattern(data),
      medicationEffectiveness: assessMedicationNeeds(data, analysis),
      emergencyProtocol: analysis.averageDuration > 2 || analysis.severityDistribution.CRITICAL > 0,
      clustersIdentified: findSeizureClusters(data).length > 0
    }
  }

  return {
    ...detailed,
    analysis: veterinaryAnalysis
  }
}

const classifySeizurePattern = (data: SeizureData[]): string => {
  if (data.length === 0) return 'No seizures recorded'
  if (data.length === 1) return 'Single episode'

  const clusters = findSeizureClusters(data)
  if (clusters.length > 0) return 'Cluster seizures detected'

  // Check for regular intervals
  const intervals = []
  for (let i = 1; i < data.length; i++) {
    const interval = differenceInDays(new Date(data[i - 1].timeRecorded), new Date(data[i].timeRecorded))
    intervals.push(interval)
  }

  const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length

  if (avgInterval < 7) return 'High frequency pattern'
  if (avgInterval < 30) return 'Weekly pattern'
  if (avgInterval < 90) return 'Monthly pattern'
  return 'Sporadic pattern'
}

const assessMedicationNeeds = (data: SeizureData[], analysisData: any): string => {
  if (analysisData.averageFrequency > 1) return 'Daily medication likely needed'
  if (analysisData.averageFrequency > 0.25) return 'Medication evaluation recommended'
  if (analysisData.severityDistribution.CRITICAL > 0) return 'Rescue medication protocol needed'
  return 'Monitor; medication may not be necessary'
}

const generateFrequencyChart = (data: SeizureData[]) => {
  // Group by week/month for frequency chart
  const groupedData = data.reduce(
    (acc, seizure) => {
      const date = formatDate(new Date(seizure.timeRecorded), 'yyyy-MM-dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(groupedData).map(([date, count]) => ({
    date,
    seizures: count
  }))
}

const generateDurationChart = (data: SeizureData[]) => {
  return data.map((seizure, index) => ({
    episode: index + 1,
    duration: seizure.duration / 60, // convert to minutes
    severity: seizure.severity,
    type: seizure.seizureType,
    date: formatDate(new Date(seizure.timeRecorded), 'MMM dd')
  }))
}

export { analyzeSeizureData, generateFrequencyChart, generateDurationChart }
