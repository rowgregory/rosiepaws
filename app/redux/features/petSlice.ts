import { petInitialState } from '@/app/lib/initial-states/pet'
import { BloodSugar, IFeeding, PainScore, Pet, ISeizure, Water, Medication } from '@/app/types/model.types'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { petApi } from '../services/petApi'
import { painScoreInitialState } from '@/app/lib/initial-states/pain-score'
import { feedingInitialState } from '@/app/lib/initial-states/feeding'
import { bloodSugarInitialState } from '@/app/lib/initial-states/bloodSugar'
import { seizureInitialState } from '@/app/lib/initial-states/seizure'
import { waterInitialState } from '@/app/lib/initial-states/water'
import { medicationInitialState } from '@/app/lib/initial-states/medication'

export interface PetStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null

  pets: Pet[]
  pet: Pet
  zeroPets: boolean
  petDrawer: boolean
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

  bloodSugars: BloodSugar[]
  bloodSugar: BloodSugar
  zeroBloodSugars: boolean
  bloodSugarDrawer: boolean
  bloodSugarCount: number

  waters: Water[]
  water: Water
  zeroWaters: boolean
  waterDrawer: boolean
  waterCount: number

  medications: Medication[]
  medication: Medication
  zeroMedications: boolean
  medicationDrawer: boolean
  medicationCount: number

  seizures: ISeizure[]
  seizure: ISeizure
  zeroSeizures: boolean
  seizureDrawer: boolean
  seizureCount: number
}

export const initialPetState: PetStatePayload = {
  loading: true,
  success: false,
  error: '',
  message: '',
  guardianActionMenu: false,

  pets: [],
  pet: petInitialState,
  zeroPets: false,
  petDrawer: false,
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
  medicationCount: 0,

  seizures: [],
  seizure: seizureInitialState,
  zeroSeizures: true,
  seizureDrawer: false,
  seizureCount: 0
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
    setOpenPainScoreDrawer: (state) => {
      state.painScoreDrawer = true
    },
    setClosePainScoreDrawer: (state) => {
      state.painScoreDrawer = false
    },
    setOpenWaterDrawer: (state) => {
      state.waterDrawer = true
    },
    setCloseWaterDrawer: (state) => {
      state.waterDrawer = false
    },
    setOpenFeedingDrawer: (state) => {
      state.feedingDrawer = true
    },
    setCloseFeedingDrawer: (state) => {
      state.feedingDrawer = false
    },
    setOpenBloodSugarDrawer: (state) => {
      state.bloodSugarDrawer = true
    },
    setCloseBloodSugarDrawer: (state) => {
      state.bloodSugarDrawer = false
    },
    setOpenMedicationDrawer: (state) => {
      state.medicationDrawer = true
    },
    setCloseMedicationDrawer: (state) => {
      state.medicationDrawer = false
    },
    setOpenSeizureDrawer: (state) => {
      state.seizureDrawer = true
    },
    setCloseSeizureDrawer: (state) => {
      state.seizureDrawer = false
    },
    setOpenGuardianActionMenu: (state) => {
      state.guardianActionMenu = true
    },
    setCloseGuardianActionMenu: (state) => {
      state.guardianActionMenu = false
    },

    addPetToState: (state, action) => {
      state.pets.push(action.payload)
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
    addMedicationToState: (state, action) => {
      state.medications.unshift(action.payload)
      state.medicationCount = state.medicationCount + 1
      state.zeroMedications = state.medications.length === 0
    },
    addMedicationToPet: (state, action) => {
      if (state.pet && Array.isArray(state.pet.medications)) {
        state.pet.medications.unshift(action.payload)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(petApi.endpoints.fetchAllPets.matchFulfilled, (state, { payload }: any) => {
        state.pets = payload.pets
        state.loading = false
        state.zeroPets = payload.pets.length === 0
        state.petCount = payload.pets.length
      })
      .addMatcher(petApi.endpoints.fetchMyPets.matchFulfilled, (state, { payload }: any) => {
        state.loading = false

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

        state.bloodSugars = payload.bloodSugars
        state.bloodSugar = payload.bloodSugars[0]
        state.zeroFeedings = payload.bloodSugars.length === 0
        state.bloodSugarCount = payload.bloodSugars.length

        state.seizures = payload.seizures
        state.seizure = payload.seizures[0]
        state.zeroSeizures = payload.seizures.length === 0
        state.seizureCount = payload.seizures.length

        state.waters = payload.waters
        state.water = payload.waters[0]
        state.zeroWaters = payload.waters.length === 0
        state.waterCount = payload.waters.length
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
      .addMatcher(petApi.endpoints.createPainScore.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(petApi.endpoints.createFeeding.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(petApi.endpoints.createBloodSugar.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'petApi',
        (state, { payload }) => {
          state.loading = false
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
  setOpenPainScoreDrawer,
  setClosePainScoreDrawer,
  setOpenGuardianActionMenu,
  setCloseGuardianActionMenu,
  setOpenWaterDrawer,
  setCloseWaterDrawer,
  setOpenFeedingDrawer,
  setCloseFeedingDrawer,
  setOpenBloodSugarDrawer,
  setCloseBloodSugarDrawer,
  setOpenMedicationDrawer,
  setCloseMedicationDrawer,
  addPainScoreToPet,
  updateFeedingInState,
  removeFeedingFromState,
  addFeedingToState,
  addFeedingToPet,
  addBloodSugarToState,
  addBloodSugarToPet,
  addWaterToState,
  addWaterToPet,
  setOpenSeizureDrawer,
  setCloseSeizureDrawer,
  addMedicationToPet,
  addMedicationToState
} = petSlice.actions
