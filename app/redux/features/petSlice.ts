import { petInitialState } from '@/app/lib/initial-states/pet'
import {
  IBloodSugar,
  IFeeding,
  PainScore,
  Pet,
  ISeizure,
  IWater,
  IMedication,
  IWalk,
  IAppointment,
  IMovement
} from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { petApi } from '../services/petApi'
import { painScoreInitialState } from '@/app/lib/initial-states/pain-score'
import { feedingInitialState } from '@/app/lib/initial-states/feeding'
import { bloodSugarInitialState } from '@/app/lib/initial-states/bloodSugar'
import { seizureInitialState } from '@/app/lib/initial-states/seizure'
import { waterInitialState } from '@/app/lib/initial-states/water'
import { medicationInitialState } from '@/app/lib/initial-states/medication'
import { walkInitialState } from '@/app/lib/initial-states/walk'
import { appointmentInitialState } from '@/app/lib/initial-states/appointment'
import { movementInitialState } from '@/app/lib/initial-states/movement'

export interface PetStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null

  pets: Pet[]
  pet: Pet
  zeroPets: boolean
  petDrawer: boolean
  petUpdateDrawer: boolean
  petCount: number

  painScores: PainScore[]
  painScore: PainScore
  zeroPainScores: boolean
  painScoreDrawer: boolean
  painScoreCount: number

  guardianActionMenu: boolean

  feedings: IFeeding[]
  feeding: IFeeding
  zeroFeedings: boolean
  feedingDrawer: boolean
  feedingCount: number

  walks: IWalk[]
  walk: IWalk
  zeroWalks: boolean
  walkDrawer: boolean
  walkCount: number

  appointments: IAppointment[]
  appointment: IAppointment
  zeroAppointments: boolean
  appointmentDrawer: boolean
  appointmentCount: number

  bloodSugars: IBloodSugar[]
  bloodSugar: IBloodSugar
  zeroBloodSugars: boolean
  bloodSugarDrawer: boolean
  bloodSugarCount: number

  waters: IWater[]
  water: IWater
  zeroWaters: boolean
  waterDrawer: boolean
  waterCount: number

  medications: IMedication[]
  medication: IMedication
  zeroMedications: boolean
  medicationDrawer: boolean
  updateMedicationDrawer: boolean
  medicationCount: number

  seizures: ISeizure[]
  seizure: ISeizure
  zeroSeizures: boolean
  seizureDrawer: boolean
  seizureCount: number

  movements: IMovement[]
  movement: IMovement
  zeroMovements: boolean
  movementDrawer: boolean
  movementCount: number

  tokenTransactions: any[]
  chartData: {
    painScores: any[]
    feedings: any[]
    walks: any[]
    waters: any[]
    movements: any[]
    medications: any[]
    appointments: any[]
    bloodSugars: any[]
    seizures: any[]
  }
  stats: any
  noLogs: boolean
  onboardingBanner: boolean
}

export const initialPetState: PetStatePayload = {
  loading: true,
  success: false,
  error: '',
  message: '',
  guardianActionMenu: false,

  pets: [],
  pet: petInitialState,
  zeroPets: true,
  petDrawer: false,
  petUpdateDrawer: false,
  petCount: 0,

  painScores: [],
  painScore: painScoreInitialState,
  zeroPainScores: true,
  painScoreDrawer: false,
  painScoreCount: 0,

  feedings: [],
  feeding: feedingInitialState,
  zeroFeedings: true,
  feedingDrawer: false,
  feedingCount: 0,

  walks: [],
  walk: walkInitialState,
  zeroWalks: true,
  walkDrawer: false,
  walkCount: 0,

  appointments: [],
  appointment: appointmentInitialState,
  zeroAppointments: true,
  appointmentDrawer: false,
  appointmentCount: 0,

  bloodSugars: [],
  bloodSugar: bloodSugarInitialState,
  zeroBloodSugars: true,
  bloodSugarDrawer: false,
  bloodSugarCount: 0,

  waters: [],
  water: waterInitialState,
  zeroWaters: false,
  waterDrawer: false,
  waterCount: 0,

  medications: [],
  medication: medicationInitialState,
  zeroMedications: false,
  medicationDrawer: false,
  updateMedicationDrawer: false,
  medicationCount: 0,

  seizures: [],
  seizure: seizureInitialState,
  zeroSeizures: true,
  seizureDrawer: false,
  seizureCount: 0,

  movements: [],
  movement: movementInitialState,
  zeroMovements: true,
  movementDrawer: false,
  movementCount: 0,

  tokenTransactions: [],
  chartData: {
    painScores: [],
    feedings: [],
    walks: [],
    waters: [],
    movements: [],
    medications: [],
    appointments: [],
    bloodSugars: [],
    seizures: []
  },
  stats: {},
  noLogs: true,
  onboardingBanner: true
}

interface ErrorPayload {
  data: {
    message: string
    sliceName: string
  }
}

export const petSlice = createSlice({
  name: 'pet',
  initialState: initialPetState,
  reducers: {
    setPets: (state, { payload }) => {
      state.pets = payload
    },
    setPet: (state, { payload }) => {
      state.pet = payload
    },
    setOpenPetDrawer: (state) => {
      state.petDrawer = true
    },
    setClosePetDrawer: (state) => {
      state.petDrawer = false
    },
    setOpenPetUpdateDrawer: (state) => {
      state.petUpdateDrawer = true
    },
    setClosePetUpdateDrawer: (state) => {
      state.petUpdateDrawer = false
    },
    // setOpenWaterDrawer: (state) => {
    //   state.waterDrawer = true
    // },
    // setCloseWaterDrawer: (state) => {
    //   state.waterDrawer = false
    // },
    // setOpenFeedingDrawer: (state) => {
    //   state.feedingDrawer = true
    // },
    // setCloseFeedingDrawer: (state) => {
    //   state.feedingDrawer = false
    // },
    // setOpenWalkDrawer: (state) => {
    //   state.walkDrawer = true
    // },
    // setCloseWalkDrawer: (state) => {
    //   state.walkDrawer = false
    // },
    // setOpenBloodSugarDrawer: (state) => {
    //   state.bloodSugarDrawer = true
    // },
    // setCloseBloodSugarDrawer: (state) => {
    //   state.bloodSugarDrawer = false
    // },
    // setOpenMedicationDrawer: (state) => {
    //   state.medicationDrawer = true
    // },
    // setCloseMedicationDrawer: (state) => {
    //   state.medicationDrawer = false
    // },
    // setOpenAppointmentDrawer: (state) => {
    //   state.appointmentDrawer = true
    // },
    // setCloseAppointmentDrawer: (state) => {
    //   state.appointmentDrawer = false
    // },
    // setOpenUpdateMedicationDrawer: (state) => {
    //   state.updateMedicationDrawer = true
    // },
    // setCloseUpdateMedicationDrawer: (state) => {
    //   state.updateMedicationDrawer = false
    // },
    // setOpenSeizureDrawer: (state) => {
    //   state.seizureDrawer = true
    // },
    // setCloseSeizureDrawer: (state) => {
    //   state.seizureDrawer = false
    // },
    // setOpenMovementDrawer: (state) => {
    //   state.movementDrawer = true
    // },
    // setCloseMovementDrawer: (state) => {
    //   state.movementDrawer = false
    // },
    setOpenGuardianActionMenu: (state) => {
      state.guardianActionMenu = true
    },
    setCloseGuardianActionMenu: (state) => {
      state.guardianActionMenu = false
    },

    // Pet Actions
    addPetToState: (state, action) => {
      state.pets.push(action.payload)
      state.pet = action.payload
      state.petCount = state.petCount + 1
      state.zeroPets = state.pets.length === 0
    },
    updatePetInState: (state, action) => {
      const updatedPet = action.payload
      const index = state.pets.findIndex((pet: { id: string }) => pet.id === updatedPet.id)
      if (index !== -1) {
        state.pets[index] = updatedPet
      }
    },
    removePetFromState: (state, action) => {
      state.pets = state.pets.filter((pet: { id: string }) => pet.id !== action.payload)
      state.petCount = state.petCount - 1
      state.zeroPets = state.pets.length === 0
    },

    // Pain Score Actions
    addPainScoreToState: (state, action) => {
      state.painScores.unshift(action.payload)
      state.painScoreCount = state.painScoreCount + 1
      state.zeroPainScores = state.painScores.length === 0
    },
    addPainScoreToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.painScores)) {
        state.pet.painScores.unshift(action.payload)
      }
    },
    updatePainScoreInState: (state, action) => {
      const updatedPainScore = action.payload
      const index = state.painScores.findIndex((painScore: { id: string }) => painScore.id === updatedPainScore.id)
      if (index !== -1) {
        state.painScores[index] = updatedPainScore
      }
    },

    // Feeding Actions
    updateFeedingInState: (state, action) => {
      const updatedFeeding = action.payload
      const index = state.feedings.findIndex((feeding: { id: string }) => feeding.id === updatedFeeding.id)
      if (index !== -1) {
        state.feedings[index] = updatedFeeding
      }
    },
    removeFeedingFromState: (state, action) => {
      state.feedings = state.feedings.filter((feeding: { id: string }) => feeding.id !== action.payload)
      state.feedingCount = state.feedingCount - 1
      state.zeroFeedings = state.feedings.length === 0
    },
    addFeedingToState: (state, action) => {
      state.feedings.unshift(action.payload)
      state.feedingCount = state.feedingCount + 1
      state.zeroFeedings = state.feedings.length === 0
    },
    addFeedingToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.feedings)) {
        state.pet.feedings.unshift(action.payload)
      }
    },

    // Blood Sugar Actions
    addBloodSugarToState: (state, action) => {
      state.bloodSugars.unshift(action.payload)
      state.bloodSugarCount = state.bloodSugarCount + 1
      state.zeroBloodSugars = state.bloodSugars.length === 0
    },
    addBloodSugarToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.bloodSugars)) {
        state.pet.bloodSugars.unshift(action.payload)
      }
    },

    // Water Actions
    addWaterToState: (state, action) => {
      state.waters.unshift(action.payload)
      state.waterCount = state.waterCount + 1
      state.zeroWaters = state.waters.length === 0
    },
    addWaterToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.waters)) {
        state.pet.waters.unshift(action.payload)
      }
    },

    // Medication Actions
    addMedicationToState: (state, action) => {
      state.medications.unshift(action.payload)
      state.medicationCount = state.medicationCount + 1
      state.zeroMedications = state.medications.length === 0
    },
    addMedicationToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.medications)) {
        state.pet.medications.unshift(action.payload)
      }
    },
    updateMedicationInState: (state, action) => {
      const updatedMedication = action.payload
      const index = state.medications.findIndex((medication: { id: string }) => medication.id === updatedMedication.id)
      if (index !== -1) {
        state.medications[index] = updatedMedication
      }
    },
    updateMedicationInPet: (state, action) => {
      const updatedMedication = action.payload
      const index = state.pet.medications.findIndex(
        (medication: { id: string }) => medication.id === updatedMedication.id
      )
      if (index !== -1) {
        state.pet.medications[index] = updatedMedication
      }
    },

    // Seizure Actions
    addSeizureToState: (state, action) => {
      state.seizures.unshift(action.payload)
      state.seizureCount = state.seizureCount + 1
      state.zeroSeizures = state.seizures.length === 0
    },
    addSeizureToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.seizures)) {
        state.pet.seizures.unshift(action.payload)
      }
    },

    // Walk Actions
    addWalkToState: (state, action) => {
      state.walks.unshift(action.payload)
      state.walkCount = state.walkCount + 1
      state.zeroWalks = state.walks.length === 0
    },
    addWalkToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.walks)) {
        state.pet.walks.unshift(action.payload)
      }
    },
    updateWalkInState: (state, action) => {
      const updatedWalk = action.payload
      const index = state.walks.findIndex((walk: { id: string }) => walk.id === updatedWalk.id)
      if (index !== -1) {
        state.walks[index] = updatedWalk
      }
    },
    updateWalkInPet: (state, action) => {
      const updatedWalk = action.payload
      const index = state.pet.walks.findIndex((walk: { id: string }) => walk.id === updatedWalk.id)
      if (index !== -1) {
        state.pet.walks[index] = updatedWalk
      }
    },

    // Appointment Actions
    addAppointmentToState: (state, action) => {
      state.appointments.unshift(action.payload)
      state.appointmentCount = state.appointmentCount + 1
      state.zeroAppointments = state.appointments.length === 0
    },
    addAppointmentToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.appointments)) {
        state.pet.appointments.unshift(action.payload)
      }
    },

    // Movement Actions
    addMovementToState: (state, action) => {
      state.movements.unshift(action.payload)
      state.movementCount = state.movementCount + 1
      state.zeroMovements = state.movements.length === 0
    },
    addMovementToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.movements)) {
        state.pet.movements.unshift(action.payload)
      }
    },
    setSelectedPetWithChartData: (state, action) => {
      state.pet = action.payload.pet
      state.chartData = action.payload.chartData
      state.stats = action.payload.stats
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(petApi.endpoints.fetchMyPets.matchFulfilled, (state, { payload }: any) => {
        state.pets = payload.pets
        state.pet = payload.pets[0]
        state.zeroPets = payload.pets.length === 0
        state.petCount = payload.pets.length

        state.painScores = payload.painScores
        state.painScore = payload.painScores[0]
        state.zeroPainScores = payload.painScores.length === 0
        state.painScoreCount = payload.painScores.length

        state.feedings = payload.feedings
        state.feeding = payload.feedings[0]
        state.zeroFeedings = payload.feedings.length === 0
        state.feedingCount = payload.feedings.length

        state.walks = payload.walks
        state.walk = payload.walks[0]
        state.zeroWalks = payload.walks.length === 0
        state.walkCount = payload.walks.length

        state.appointments = payload.appointments
        state.appointment = payload.appointments[0]
        state.zeroAppointments = payload.appointments.length === 0
        state.appointmentCount = payload.appointments.length

        state.bloodSugars = payload.bloodSugars
        state.bloodSugar = payload.bloodSugars[0]
        state.zeroBloodSugars = payload.bloodSugars.length === 0
        state.bloodSugarCount = payload.bloodSugars.length

        state.seizures = payload.seizures
        state.seizure = payload.seizures[0]
        state.zeroSeizures = payload.seizures.length === 0
        state.seizureCount = payload.seizures.length

        state.waters = payload.waters
        state.water = payload.waters[0]
        state.zeroWaters = payload.waters.length === 0
        state.waterCount = payload.waters.length

        state.medications = payload.medications
        state.medication = payload.medications[0]
        state.zeroMedications = payload.medications.length === 0
        state.medicationCount = payload.medications.length

        state.movements = payload.movements
        state.movement = payload.movements[0]
        state.zeroMovements = payload.movements.length === 0
        state.movementCount = payload.movements.length

        state.tokenTransactions = payload.tokenTransactions
        state.chartData = payload.chartData
        state.stats = payload.stats
        state.noLogs =
          state.zeroFeedings &&
          state.zeroPainScores &&
          state.zeroWalks &&
          state.zeroWaters &&
          state.zeroMovements &&
          state.zeroMedications &&
          state.zeroAppointments &&
          state.zeroBloodSugars &&
          state.zeroSeizures
        state.onboardingBanner = state.noLogs

        state.loading = false
      })
      .addMatcher(petApi.endpoints.createPet.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(petApi.endpoints.updatePet.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(petApi.endpoints.deletePet.matchFulfilled, (state) => {
        state.success = true
        state.loading = false
      })
      // .addMatcher(petApi.endpoints.createFeeding.matchFulfilled, (state) => {
      //   state.loading = false
      // })
      // .addMatcher(petApi.endpoints.createBloodSugar.matchFulfilled, (state) => {
      //   state.loading = false
      // })
      // .addMatcher(petApi.endpoints.createMedication.matchFulfilled, (state) => {
      //   state.loading = false
      // })
      // .addMatcher(petApi.endpoints.updateMedication.matchFulfilled, (state) => {
      //   state.loading = false
      // })
      // .addMatcher(petApi.endpoints.createSeizure.matchFulfilled, (state) => {
      //   state.loading = false
      // })
      // .addMatcher(petApi.endpoints.createWalk.matchFulfilled, (state) => {
      //   state.loading = false
      // })
      // .addMatcher(petApi.endpoints.createAppointment.matchFulfilled, (state) => {
      //   state.loading = false
      // })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'petApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const petReducer = petSlice.reducer as Reducer<PetStatePayload>

export const {
  setPets,
  setPet,
  setOpenPetDrawer,
  setClosePetDrawer,
  addPetToState,
  updatePetInState,
  removePetFromState,
  addPainScoreToState,
  setOpenGuardianActionMenu,
  setCloseGuardianActionMenu,
  // setOpenWaterDrawer,
  // setCloseWaterDrawer,
  // setOpenFeedingDrawer,
  // setCloseFeedingDrawer,
  // setOpenBloodSugarDrawer,
  // setCloseBloodSugarDrawer,
  // setOpenMedicationDrawer,
  // setCloseMedicationDrawer,
  addPainScoreToPet,
  updateFeedingInState,
  removeFeedingFromState,
  addFeedingToState,
  addFeedingToPet,
  addBloodSugarToState,
  addBloodSugarToPet,
  addWaterToState,
  addWaterToPet,
  // setOpenSeizureDrawer,
  // setCloseSeizureDrawer,
  addMedicationToPet,
  addMedicationToState,
  updateMedicationInState,
  updateMedicationInPet,
  // setCloseUpdateMedicationDrawer,
  // setOpenUpdateMedicationDrawer,
  addSeizureToState,
  addSeizureToPet,
  // setOpenWalkDrawer,
  // setCloseWalkDrawer,
  // setOpenAppointmentDrawer,
  // setCloseAppointmentDrawer,
  addWalkToState,
  addWalkToPet,
  addAppointmentToState,
  addAppointmentToPet,
  updateWalkInPet,
  updateWalkInState,
  // setOpenMovementDrawer,
  // setCloseMovementDrawer,
  addMovementToPet,
  addMovementToState,
  setOpenPetUpdateDrawer,
  setClosePetUpdateDrawer,
  updatePainScoreInState,
  setSelectedPetWithChartData
} = petSlice.actions
