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
  medicationCreateDrawer: boolean
  medicationUpdateDrawer: boolean
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
  medicationCreateDrawer: false,
  medicationUpdateDrawer: false,
  medicationCount: 0
}

export const medicationSlice = createSlice({
  name: 'medication',
  initialState: initialMedicationState,
  reducers: {
    setOpenMedicationCreateDrawer: (state) => {
      state.medicationCreateDrawer = true
    },
    setCloseMedicationCreateDrawer: (state) => {
      state.medicationCreateDrawer = false
    },
    setOpenMedicationUpdateDrawer: (state) => {
      state.medicationUpdateDrawer = true
    },
    setCloseMedicationUpdateDrawer: (state) => {
      state.medicationUpdateDrawer = false
    },
    addMedicationsToState: (state, { payload }) => {
      state.medications = payload
      state.zeroMedications = payload.length === 0
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
  setOpenMedicationCreateDrawer,
  setCloseMedicationCreateDrawer,
  setOpenMedicationUpdateDrawer,
  setCloseMedicationUpdateDrawer,
  addMedicationsToState
} = medicationSlice.actions
