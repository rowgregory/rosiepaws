interface IProcessedChartData {
  painScores: any[]
  bloodSugars: any[]
  feedings: any[]
  waters: any[]
  medications: any[]
  seizures: any[]
  walks: any[]
  appointments: any[]
  movements: any[]
}

export const processChartDataForPet = (pet: any): IProcessedChartData => {
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
    painScores: pet.painScores?.map((obj: any) => ({
      ...obj,
      date: new Date(obj.timeRecorded).toLocaleDateString(),
      time: new Date(obj.timeRecorded).toLocaleTimeString()
    })),
    feedings:
      pet.feedings
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString([], { timeStyle: 'short' })
        }))
        .sort((a: any, b: any) => +new Date(b.timeRecorded) - +new Date(a.timeRecorded)) || [],

    bloodSugars:
      pet.bloodSugars
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString(),
          value: parseInt(obj.value),
          status: obj.value < 80 ? 'low' : obj.value > 180 ? 'high' : obj.value > 120 ? 'elevated' : 'normal'
        }))
        .sort((a: any, b: any) => +new Date(b.timeRecorded) - +new Date(a.timeRecorded)) || [],

    seizures:
      pet.seizures
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString()
        }))
        .sort((a: any, b: any) => +new Date(b.timeRecorded) - +new Date(a.timeRecorded)) || [],

    waters:
      pet.waters
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString()
        }))
        .sort((a: any, b: any) => +new Date(b.timeRecorded) - +new Date(a.timeRecorded)) || [],

    medications:
      pet.medications
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString()
        }))
        .sort((a: any, b: any) => +new Date(b.timeRecorded) - +new Date(a.timeRecorded)) || [],

    walks:
      pet.walks
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString()
        }))
        .sort((a: any, b: any) => +new Date(b.timeRecorded) - +new Date(a.timeRecorded)) || [],

    appointments:
      pet.appointments
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.date).toLocaleDateString(),
          time: obj.time
        }))
        .sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt)) || [],

    movements:
      pet.movements
        ?.map((obj: any) => ({
          ...obj,
          date: new Date(obj.timeRecorded).toLocaleDateString(),
          time: new Date(obj.timeRecorded).toLocaleTimeString()
        }))
        .sort((a: any, b: any) => +new Date(b.timeRecorded) - +new Date(a.timeRecorded)) || []
  }
}
