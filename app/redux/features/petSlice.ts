import { petInitialState } from '@/app/lib/initial-states/pet'
import { Pet } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { petApi } from '../services/petApi'

export interface PetStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  guardianActionMenu: boolean

  pets: Pet[]
  pet: Pet
  zeroPets: boolean
  petDrawer: boolean
  petCount: number

  chartData: {
    painScores: any[]
    feedings: any[]
    vitalSigns: any[]
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
  petsWithNoLogs: [{ id: string; name: string; noLogs: boolean }]
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
  petCount: 0,

  chartData: {
    painScores: [],
    feedings: [],
    vitalSigns: [],
    waters: [],
    movements: [],
    medications: [],
    appointments: [],
    bloodSugars: [],
    seizures: []
  },
  stats: {},
  noLogs: true,
  onboardingBanner: true,
  petsWithNoLogs: [{ id: '', name: '', noLogs: false }]
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
      state.zeroPets = payload.length === 0
      state.petCount = payload.length
      state.loading = false
    },
    setPet: (state, { payload }) => {
      state.pet = payload
      state.loading = false

      const filteredPet = state.petsWithNoLogs.filter((pet) => pet.id === payload.id)[0]
      const petNoLogs = filteredPet?.noLogs
      state.noLogs = petNoLogs
      state.onboardingBanner = petNoLogs
    },
    setPetStats: (state, { payload }) => {
      state.stats = payload
      state.loading = false
    },
    setPetsWithNoLogs: (state, { payload }) => {
      state.petsWithNoLogs = payload
      state.loading = false
    },
    setChartData: (state, { payload }) => {
      state.chartData = payload
    },
    setOpenPetDrawer: (state) => {
      state.petDrawer = true
    },
    setClosePetDrawer: (state) => {
      state.petDrawer = false
    },
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
      const { findById, replaceWith, ...updatedPet } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.pets.findIndex((pet) => pet.id === findById)
        if (index !== -1) {
          state.pets[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.pets.findIndex((pet) => pet.id === updatedPet.id)
        if (index !== -1) {
          state.pets[index] = updatedPet
        }
      }
    },
    removePetFromState: (state, action) => {
      state.pets = state.pets.filter((pet: { id: string }) => pet.id !== action.payload)
      state.petCount = state.petCount - 1
      state.zeroPets = state.pets.length === 0
    },

    // Pain Score.....................
    addPainScoreToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.painScores)) {
        state.pet.painScores.unshift(action.payload)
      }
    },
    updatePainScoreInPet: (state, action) => {
      const updatedPainScore = action.payload
      const index = state.pet.painScores.findIndex((painScore: { id: string }) => painScore.id === updatedPainScore.id)
      if (index !== -1) {
        state.pet.painScores[index] = updatedPainScore
      }
    },

    // Feeding.....................
    addFeedingToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.feedings)) {
        state.pet.feedings.unshift(action.payload)
      }
    },
    updateFeedingInPet: (state, action) => {
      const updatedFeeding = action.payload
      const index = state.pet.feedings.findIndex((feeding: { id: string }) => feeding.id === updatedFeeding.id)
      if (index !== -1) {
        state.pet.feedings[index] = updatedFeeding
      }
    },

    // Blood Sugar.....................
    addBloodSugarToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.bloodSugars)) {
        state.pet.bloodSugars.unshift(action.payload)
      }
    },
    updateBloodSugarInPet: (state, action) => {
      const updatedBloodSugar = action.payload
      const index = state.pet.bloodSugars.findIndex(
        (bloodSugar: { id: string }) => bloodSugar.id === updatedBloodSugar.id
      )
      if (index !== -1) {
        state.pet.bloodSugars[index] = updatedBloodSugar
      }
    },

    // Water.....................
    addWaterToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.waters)) {
        state.pet.waters.unshift(action.payload)
      }
    },
    updateWaterInPet: (state, action) => {
      const updatedWater = action.payload
      const index = state.pet.waters.findIndex((water: { id: string }) => water.id === updatedWater.id)
      if (index !== -1) {
        state.pet.waters[index] = updatedWater
      }
    },

    // Medication.....................
    addMedicationToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.medications)) {
        state.pet.medications.unshift(action.payload)
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

    // Seizure.....................
    addSeizureToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.seizures)) {
        state.pet.seizures.unshift(action.payload)
      }
    },
    updateSeizureInPet: (state, action) => {
      const updatedSeizure = action.payload
      const index = state.pet.seizures.findIndex((seizure: { id: string }) => seizure.id === updatedSeizure.id)
      if (index !== -1) {
        state.pet.seizures[index] = updatedSeizure
      }
    },

    // Vital Signs.....................
    addVitalSignToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.vitalSigns)) {
        state.pet.vitalSigns.unshift(action.payload)
      }
    },
    updateVitalSignInPet: (state, action) => {
      const updatedVitalSign = action.payload
      const index = state.pet.vitalSigns.findIndex((vitalSign: { id: string }) => vitalSign.id === updatedVitalSign.id)
      if (index !== -1) {
        state.pet.vitalSigns[index] = updatedVitalSign
      }
    },

    // Appointment.....................
    addAppointmentToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.appointments)) {
        state.pet.appointments.unshift(action.payload)
      }
    },
    updateAppointmentInPet: (state, action) => {
      const updatedAppointment = action.payload
      const index = state.pet.appointments.findIndex(
        (appointment: { id: string }) => appointment.id === updatedAppointment.id
      )
      if (index !== -1) {
        state.pet.appointments[index] = updatedAppointment
      }
    },

    // Movement.....................
    addMovementToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.movements)) {
        state.pet.movements.unshift(action.payload)
      }
    },
    updateMovementInPet: (state, action) => {
      const updatedMovement = action.payload
      const index = state.pet.movements.findIndex((movement: { id: string }) => movement.id === updatedMovement.id)
      if (index !== -1) {
        state.pet.movements[index] = updatedMovement
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
  setOpenGuardianActionMenu,
  setCloseGuardianActionMenu,
  addPainScoreToPet,
  updatePainScoreInPet,
  addFeedingToPet,
  updateFeedingInPet,
  addBloodSugarToPet,
  updateBloodSugarInPet,
  addWaterToPet,
  updateWaterInPet,
  addMedicationToPet,
  updateMedicationInPet,
  addSeizureToPet,
  updateSeizureInPet,
  addVitalSignToPet,
  updateVitalSignInPet,
  addAppointmentToPet,
  updateAppointmentInPet,
  addMovementToPet,
  updateMovementInPet,
  setSelectedPetWithChartData,
  setPetStats,
  setChartData,
  setPetsWithNoLogs
} = petSlice.actions
