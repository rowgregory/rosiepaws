import { getDashboardNextAppointment } from './dateUtils'

export interface ChartData {
  painScores: any[]
  feedings: any[]
  waters: any[]
  walks: any[]
  medications: any[]
  movements: any[]
  appointments: any[]
  bloodSugars: any[]
  seizures: any[]
}

interface PetStats {
  painScores: {
    mostRecent: number
    average: number
    trend: 'up' | 'down' | 'stable'
    hasPainScores: boolean
    totalLogs: number
  }
  feedings: {
    mostRecent: number
    average: number
    trend: 'up' | 'down' | 'stable'
    hasFeedings: boolean
    totalLogs: number
  }
  waters: {
    mostRecent: number
    average: number
    trend: 'up' | 'down' | 'stable'
    hasWaters: boolean
    totalLogs: number
  }
  walks: {
    mostRecent: number
    average: number
    trend: 'up' | 'down' | 'stable'
    hasWalks: boolean
    totalLogs: number
  }
  movements: {
    mostRecent: number
    average: number
    trend: 'up' | 'down' | 'stable'
    hasMovements: boolean
    totalLogs: number
  }
  medications: {
    mostRecent: string | number
    hasMedications: boolean
    totalLogs: number
    dosage: any
    dosageUnit: any
  }
  appointments: {
    mostRecent: string
    average: number
    trend: string
    hasAppointments: boolean
    totalLogs: number
    date: any
    time: any
  }
  bloodSugars: {
    mostRecent: number
    average: number
    trend: 'up' | 'down' | 'stable'
    hasBloodSugars: boolean
    totalLogs: number
  }
  seizures: {
    mostRecent: number
    average: number
    trend: 'up' | 'down' | 'stable'
    hasSeizures: boolean
    totalLogs: number
  }
}

const emptyState: PetStats = {
  painScores: {
    mostRecent: 0,
    average: 0,
    trend: 'up',
    hasPainScores: false,
    totalLogs: 0
  },
  feedings: {
    mostRecent: 0,
    average: 0,
    trend: 'up',
    hasFeedings: false,
    totalLogs: 0
  },
  waters: {
    mostRecent: 0,
    average: 0,
    trend: 'up',
    hasWaters: false,
    totalLogs: 0
  },
  walks: {
    mostRecent: 0,
    average: 0,
    trend: 'up',
    hasWalks: false,
    totalLogs: 0
  },
  movements: {
    mostRecent: 0,
    average: 0,
    trend: 'up',
    hasMovements: false,
    totalLogs: 0
  },
  medications: {
    mostRecent: '',
    hasMedications: false,
    totalLogs: 0,
    dosage: undefined,
    dosageUnit: undefined
  },
  appointments: {
    mostRecent: '',
    average: 0,
    trend: '',
    hasAppointments: false,
    totalLogs: 0,
    date: undefined,
    time: undefined
  },
  bloodSugars: {
    mostRecent: 0,
    average: 0,
    trend: 'up',
    hasBloodSugars: false,
    totalLogs: 0
  },
  seizures: {
    mostRecent: 0,
    average: 0,
    trend: 'up',
    hasSeizures: false,
    totalLogs: 0
  }
}

export const calculatePetStats = (pet: any, chartData: ChartData): PetStats => {
  if (!pet || !chartData) return emptyState

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const { painScores, feedings, waters, walks, medications, movements, appointments, bloodSugars, seizures } = chartData

  const weekPain = painScores?.filter((item) => new Date(item.date) >= weekAgo) || []
  const weekFeeding = feedings?.filter((item) => new Date(item.date) >= weekAgo) || []
  const weekWater = waters?.filter((item) => new Date(item.date) >= weekAgo) || []
  const weekWalks = walks?.filter((item) => new Date(item.date) >= weekAgo) || []
  const weekMovements = movements?.filter((item) => new Date(item.date) >= weekAgo) || []
  const nextAppointment = getDashboardNextAppointment(appointments)
  const weekBloodSugars = bloodSugars?.filter((item) => new Date(item.date) >= weekAgo) || []
  const weekSeizures = seizures?.filter((item) => new Date(item.date) >= weekAgo) || []

  return {
    painScores: {
      mostRecent: painScores.length > 0 ? painScores[0].score : 0, // Most recent record score
      average:
        weekPain.length > 0 ? Math.round(weekPain.reduce((sum, item) => sum + item.score, 0) / weekPain.length) : 0,
      trend: weekPain.length >= 2 ? (weekPain[0].score > weekPain[1].score ? 'up' : 'down') : 'stable',
      hasPainScores: (painScores?.length || 0) > 0,
      totalLogs: painScores?.length || 0
    },
    feedings: {
      mostRecent: feedings.length > 0 ? feedings[0].foodAmount : 0,
      average:
        weekFeeding.length > 0
          ? Math.round(weekFeeding.reduce((sum, item) => sum + parseInt(item.foodAmount), 0) / weekFeeding.length)
          : 0,
      trend:
        weekFeeding.length >= 2 ? (weekFeeding[0].moodRating > weekFeeding[1].moodRating ? 'up' : 'down') : 'stable',
      hasFeedings: (feedings?.length || 0) > 0,
      totalLogs: feedings?.length || 0
    },
    waters: {
      mostRecent: waters.length > 0 ? waters[0].milliliters : 0,
      average:
        weekWater.length > 0
          ? Math.round(weekWater.reduce((sum, item) => sum + Number(item.milliliters || 0), 0) / weekWater.length)
          : 0,
      trend:
        weekWater.length >= 2
          ? weekWater[0].milliliters || 0 > weekWater[1].milliliters || 0
            ? 'up'
            : 'down'
          : 'stable',
      hasWaters: (waters?.length || 0) > 0,
      totalLogs: waters?.length || 0
    },
    walks: {
      mostRecent: walks.length > 0 ? walks[0].distance : 0,
      average:
        weekWalks.length > 0
          ? Math.round(weekWalks.reduce((sum, item) => sum + Number(item.distance || 0), 0) / weekWalks.length)
          : 0,
      trend: weekWalks.length >= 2 ? (weekWalks[0].distance ? 'up' : 'down') : 'stable',
      hasWalks: (walks?.length || 0) > 0,
      totalLogs: walks?.length || 0
    },
    movements: {
      mostRecent: movements.length > 0 ? movements[0].durationMinutes : 0,
      average:
        weekMovements.length > 0
          ? Math.round(
              weekMovements.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0) / weekMovements.length
            )
          : 0,
      trend: weekMovements.length >= 2 ? (weekMovements[0].durationMinutes ? 'up' : 'down') : 'stable',
      hasMovements: (movements?.length || 0) > 0,
      totalLogs: movements?.length || 0
    },
    medications: {
      mostRecent: medications.length > 0 ? medications?.[0]?.drugName : 0,
      hasMedications: (medications?.length || 0) > 0,
      totalLogs: medications?.length || 0,
      dosage: medications?.[0]?.dosage,
      dosageUnit: medications?.[0]?.dosageUnit
    },
    appointments: {
      mostRecent:
        appointments.length > 0
          ? nextAppointment.serviceType?.charAt(0).toUpperCase() + nextAppointment.serviceType?.slice(1).toLowerCase()
          : '--',
      average: 0,
      trend: '--',
      hasAppointments: (appointments?.length || 0) > 0,
      totalLogs: appointments?.length || 0,
      date: nextAppointment?.date,
      time: nextAppointment?.time
    },
    bloodSugars: {
      mostRecent: bloodSugars.length > 0 ? bloodSugars[0]?.value : 0,
      average:
        weekBloodSugars.length > 0
          ? Math.round(weekBloodSugars.reduce((sum, item) => sum + Number(item.value || 0), 0) / weekBloodSugars.length)
          : 0,
      trend:
        weekBloodSugars.length >= 2 ? (weekBloodSugars[weekBloodSugars.length - 1].value ? 'up' : 'down') : 'stable',
      hasBloodSugars: (bloodSugars?.length || 0) > 0 || false,
      totalLogs: bloodSugars?.length || 0
    },
    seizures: {
      mostRecent: seizures.length > 0 ? seizures[0]?.duration : 0,
      average:
        weekBloodSugars.length > 0 ? weekSeizures.reduce((sum, seizure) => sum + Number(seizure.duration), 0) : 0,
      trend: weekSeizures.length >= 2 ? (weekSeizures[weekSeizures.length - 1].duration ? 'up' : 'down') : 'stable',
      hasSeizures: (seizures?.length || 0) > 0 || false,
      totalLogs: seizures?.length || 0
    }
  }
}
