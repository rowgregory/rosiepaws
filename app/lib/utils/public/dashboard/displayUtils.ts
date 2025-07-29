export const getActiveStyles = (color: string, isActive: boolean) => {
  if (!isActive) return 'border-gray-200 bg-white hover:border-gray-300'

  const colorMap: any = {
    red: 'border-red-300 bg-gradient-to-br from-red-50 to-red-100',
    orange: 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100',
    blue: 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'border-green-300 bg-gradient-to-br from-green-50 to-green-100',
    purple: 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100',
    yellow: 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100',
    gray: 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100',
    fuchsia: 'border-fuchsia-300 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100'
  }

  return colorMap[color] || 'border-red-300 bg-gradient-to-br from-red-50 to-red-100'
}

export const getPainScoreColor = (score: number) => {
  switch (score) {
    case 0:
      return 'text-green-600'
    case 1:
      return 'text-yellow-600'
    case 2:
      return 'text-orange-600'
    case 3:
      return 'text-red-600'
    case 4:
      return 'text-red-800'
    default:
      return 'text-gray-600'
  }
}

export interface IProcessedChartData {
  painScores: {
    date: string
    time: string
    score: number
    symptoms?: string
    location?: string
    triggers?: string
    relief?: string
    notes?: string
  }[]

  bloodSugars: {
    date: string
    time: string
    value: number
    status: 'low' | 'normal' | 'elevated' | 'high'
    mealRelation?: 'FASTING' | 'BEFORE_MEAL' | 'AFTER_MEAL' | 'BEDTIME' | 'RANDOM'
    measurementUnit?: 'MG_DL' | 'MMOL_L'
    targetRange?: string
    symptoms?: string
    medicationGiven?: boolean
  }[]

  feedings: {
    id: string
    date: string
    time: string
    timeRecorded: string
    amount: string
    foodAmount: string
    type: string
    foodType: string
    moodRating: number
    brand: string
    ingredients?: string
    notes?: string
    petId: string
    createdAt: string
    updatedAt: string
  }[]

  waters: {
    date: string
    time: string
    intakeType: string
    milliliters: number
    relativeIntake: string
    timeRecorded: string
    moodRating: number
  }[]

  medications: {
    date: string
    time: string
    drugName: string
    dosage: string
    dosageUnit: string
    reminderEnabled: boolean
    frequency: string
    sentRemindersToday: number
  }[]

  movements: {
    date: string
    time: string
    movementType: string
    durationMinutes: number
    distanceMeters: number
    activityLevel: string
    location: string
    indoor: boolean
    energyBefore: string
    energyAfter: string
    painBefore: number
    painAfter: number
    gaitQuality: string
    mobility: string
    assistance: string
    wheelchair: boolean
    harness: boolean
    leash: boolean
    enthusiasm: number
    reluctance: boolean
    limping: boolean
    panting: boolean
    restBreaks: number
    recoveryTime: number
  }[]

  seizures: {
    date: string
    time: string
    duration: number
    notes?: string
    videoUrl?: string
    videoFilename?: string
    seizureType?: 'GENERALIZED' | 'FOCAL' | 'ABSENCE' | 'TONIC_CLONIC' | 'MYOCLONIC'
    severity?: 'MILD' | 'MODERATE' | 'SEVERE'
    triggerFactor?: string
    recoveryTime?: number
  }[]

  walks: {
    date: string
    time: string
    distance: number
    pace: string
    distraction: string
    moodRating: number
    notes?: string
    timeRecorded: string
  }[]

  appointments: {
    date: string
    time: string
    serviceType: string
    status: string
    description: string
    veterinarian: string
    reminderEnabled: boolean
    reminderTime: string
  }[]
}

export const processChartData = (pet: any): IProcessedChartData => {
  if (!pet) {
    return {
      painScores: [],
      bloodSugars: [],
      feedings: [],
      waters: [],
      medications: [],
      seizures: [],
      walks: [],
      appointments: [],
      movements: []
    }
  }

  return {
    painScores:
      pet?.painScores
        ?.map((obj: any) => ({
          date: new Date(obj.createdAt).toLocaleDateString(),
          time: new Date(obj.createdAt).toLocaleTimeString(),
          score: obj.score,
          symptoms: obj.symptoms,
          location: obj.location,
          triggers: obj.triggers,
          relief: obj.relief,
          notes: obj.notes
        }))
        ?.reverse() || [],
    feedings:
      pet?.feedings?.map((obj: any) => ({
        id: obj.id,
        date: new Date(obj.timeRecorded).toLocaleDateString(),
        time: new Date(obj.timeRecorded).toLocaleTimeString([], {
          timeStyle: 'short'
        }),
        timeRecorded: obj.timeRecorded,
        amount: obj.foodAmount,
        foodAmount: obj.foodAmount,
        type: obj.foodType,
        foodType: obj.foodType,
        moodRating: obj.moodRating,
        brand: obj.brand,
        ingredients: obj.ingredients,
        notes: obj.notes,
        petId: obj.petId,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      })) || [],

    waters:
      pet?.waters?.map((obj: any) => ({
        date: new Date(obj.timeRecorded).toLocaleDateString(),
        time: new Date(obj.timeRecorded).toLocaleTimeString(),
        intakeType: obj.intakeType,
        milliliters: obj.milliliters,
        timeRecorded: obj.timeRecorded,
        moodRating: obj.moodRating,
        notes: obj.notes
      })) || [],
    walks:
      pet?.walks?.map((obj: any) => ({
        date: new Date(obj.timeRecorded).toLocaleDateString(),
        time: new Date(obj.timeRecorded).toLocaleTimeString(),
        distance: obj.distance,
        duration: obj.duration,
        pace: obj.pace,
        distraction: obj.distraction,
        moodRating: obj.moodRating,
        notes: obj.notes,
        timeRecorded: obj.timeRecorded
      })) || [],
    movements:
      pet?.movements?.map((obj: any) => ({
        date: new Date(obj.timeRecorded).toLocaleDateString(),
        time: new Date(obj.timeRecorded).toLocaleTimeString(),
        movementType: obj.movementType,
        durationMinutes: obj.durationMinutes,
        distanceMeters: obj.distanceMeters,
        activityLevel: obj.activityLevel,
        location: obj.location,
        indoor: obj.indoor,
        energyBefore: obj.energyBefore,
        energyAfter: obj.energyAfter,
        painBefore: obj.painBefore,
        painAfter: obj.painAfter,
        gaitQuality: obj.gaitQuality,
        mobility: obj.mobility,
        assistance: obj.assistance,
        wheelchair: obj.wheelchair,
        harness: obj.harness,
        leash: obj.leash,
        enthusiasm: obj.enthusiasm,
        reluctance: obj.reluctance,
        limping: obj.limping,
        panting: obj.panting,
        restBreaks: obj.restBreaks,
        recoveryTime: obj.recoveryTime
      })) || [],

    medications:
      pet?.medications?.map((obj: any) => ({
        date: new Date(obj.timeRecorded).toLocaleDateString(),
        time: new Date(obj.timeRecorded).toLocaleTimeString(),
        drugName: obj.drugName,
        dosage: obj.dosage,
        dosageUnit: obj.dosageUnit,
        reminderEnabled: obj.reminderEnabled,
        frequency: obj.frequency,
        sentRemindersToday: obj.sentRemindersToday,
        prescribedBy: obj.prescribedBy,
        startDate: obj.startDate,
        endDate: obj.endDate
      })) || [],
    appointments:
      pet?.appointments?.map((obj: any) => ({
        date: new Date(obj.date).toLocaleDateString(),
        time: obj.time,
        serviceType: obj.serviceType,
        status: obj.status,
        description: obj.description,
        veterinarian: obj.veterinarian,
        reminderEnabled: obj.reminderEnabled,
        reminderTime: obj.reminderTime,
        pet: obj.pet
      })) || [],
    bloodSugars:
      pet?.bloodSugars?.map((obj: any) => ({
        date: new Date(obj.timeRecorded).toLocaleDateString(),
        time: new Date(obj.timeRecorded).toLocaleTimeString(),
        value: parseInt(obj.value),
        mealRelation: obj.mealRelation,
        measurementUnit: obj.measurementUnit,
        targetRange: obj.targetRange,
        symptoms: obj.symptoms,
        medicationGiven: obj.medicationGiven,
        status: obj.value < 80 ? 'low' : obj.value > 180 ? 'high' : obj.value > 120 ? 'elevated' : 'normal'
      })) || [],
    seizures:
      pet?.seizures?.map((obj: any) => ({
        date: new Date(obj.timeRecorded).toLocaleDateString(),
        time: new Date(obj.timeRecorded).toLocaleTimeString(),
        duration: obj.duration,
        videoUrl: obj.videoUrl,
        seizureType: obj.seizureType,
        severity: obj.severity,
        triggerFactor: obj.triggerFactor,
        recoveryTime: obj.recoveryTime
      })) || []
  }
}
