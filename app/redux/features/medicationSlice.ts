import { IMedication } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { medicationInitialState } from '@/app/lib/initial-states/medication'
import { medicationApi } from '../services/medicationApi'
import { ErrorPayload } from '@/app/types'

export interface MedicationStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  medications: IMedication[]
  medication: IMedication
  zeroMedications: boolean
  medicationDrawer: boolean
  medicationCount: number
}

export const initialMedicationState: MedicationStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  medications: [],
  medication: medicationInitialState,
  zeroMedications: true,
  medicationDrawer: false,
  medicationCount: 0
}

export const medicationSlice = createSlice({
  name: 'medication',
  initialState: initialMedicationState,
  reducers: {
    setOpenMedicationDrawer: (state) => {
      state.medicationDrawer = true
    },
    setCloseMedicationDrawer: (state) => {
      state.medicationDrawer = false
    },
    setMedications: (state, { payload }) => {
      state.medications = payload
      state.zeroMedications = payload.length === 0
    },
    addMedicationToState: (state, { payload }) => {
      state.medications.unshift(payload)
      state.zeroMedications = state.medications.length === 0
    },
    updateMedicationInState: (state, action) => {
      const { findById, replaceWith, ...updatedMedication } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.medications.findIndex((pain) => pain?.id === findById)
        if (index !== -1) {
          state.medications[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.medications.findIndex((pain) => pain?.id === updatedMedication?.id)
        if (index !== -1) {
          state.medications[index] = updatedMedication
        }
      }
    },
    removeMedicationFromState: (state, action) => {
      state.medications = state.medications.filter((pain: { id: string }) => pain?.id !== action.payload)
      state.medicationCount = state.medicationCount - 1
      state.zeroMedications = state.medications.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(medicationApi.endpoints.createMedication.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(medicationApi.endpoints.createMedication.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(medicationApi.endpoints.updateMedication.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(medicationApi.endpoints.updateMedication.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(medicationApi.endpoints.deleteMedication.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(medicationApi.endpoints.deleteMedication.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'medicationApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const medicationReducer = medicationSlice.reducer as Reducer<MedicationStatePayload>

export const {
  addMedicationToState,
  removeMedicationFromState,
  setCloseMedicationDrawer,
  setMedications,
  setOpenMedicationDrawer,
  updateMedicationInState
} = medicationSlice.actions
