import { petInitialState } from '@/app/lib/initial-states/pet'
import { IFeeding, PainScore, Pet } from '@/app/types/model.types'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { petApi } from '../services/petApi'
import { painScoreInitialState } from '@/app/lib/initial-states/pain-score'
import { feedingInitialState } from '@/app/lib/initial-states/feeding'

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

  waterDrawer: boolean
  medicationDrawer: boolean
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

  waterDrawer: false,
  medicationDrawer: false
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
    setOpenMedicationDrawer: (state) => {
      state.medicationDrawer = true
    },
    setCloseMedicationDrawer: (state) => {
      state.medicationDrawer = false
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
      if (state.pet && Array.isArray(state.pet.painScore)) {
        state.pet.painScore.unshift(action.payload)
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
  setOpenMedicationDrawer,
  setCloseMedicationDrawer,
  addPainScoreToPet,
  updateFeedingInState,
  removeFeedingFromState,
  addFeedingToState,
  addFeedingToPet
} = petSlice.actions
