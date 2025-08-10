import { Vet } from '@/app/types/vet'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { vetApi } from '../services/vetApi'

interface VetState {
  // UI state that's not handled by RTK Query
  isEditingVet: boolean
  selectedVetId: string | null
  vetSearchQuery: string
  vetFilters: {
    speciality?: string
    location?: string
  }
  // Cache user preferences
  preferences: {
    autoSaveFormData: boolean
    showEmergencyContactFirst: boolean
  }
  // Additional state for tracking API operations
  lastUpdated: string | null
  operationStatus: {
    isCreating: boolean
    isUpdating: boolean
    isDeleting: boolean
    lastOperation: 'create' | 'update' | 'delete' | null
    lastOperationSuccess: boolean
  }
  // Form state management
  formState: {
    isDirty: boolean
    hasUnsavedChanges: boolean
    lastSavedData: Partial<Vet> | null
  }
}

const initialState: VetState = {
  isEditingVet: false,
  selectedVetId: null,
  vetSearchQuery: '',
  vetFilters: {},
  preferences: {
    autoSaveFormData: true,
    showEmergencyContactFirst: false
  },
  lastUpdated: null,
  operationStatus: {
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    lastOperation: null,
    lastOperationSuccess: false
  },
  formState: {
    isDirty: false,
    hasUnsavedChanges: false,
    lastSavedData: null
  }
}

export const vetSlice = createSlice({
  name: 'vet',
  initialState,
  reducers: {
    setEditingVet: (state, action: PayloadAction<boolean>) => {
      state.isEditingVet = action.payload
      // Reset form state when starting/stopping edit
      if (!action.payload) {
        state.formState.isDirty = false
        state.formState.hasUnsavedChanges = false
      }
    },
    setSelectedVetId: (state, action: PayloadAction<string | null>) => {
      state.selectedVetId = action.payload
    },
    setVetSearchQuery: (state, action: PayloadAction<string>) => {
      state.vetSearchQuery = action.payload
    },
    setVetFilters: (state, action: PayloadAction<Partial<VetState['vetFilters']>>) => {
      state.vetFilters = { ...state.vetFilters, ...action.payload }
    },
    updatePreferences: (state, action: PayloadAction<Partial<VetState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    setFormDirty: (state, action: PayloadAction<boolean>) => {
      state.formState.isDirty = action.payload
      state.formState.hasUnsavedChanges = action.payload
    },
    saveFormSnapshot: (state, action: PayloadAction<Partial<Vet>>) => {
      state.formState.lastSavedData = action.payload
      state.formState.isDirty = false
      state.formState.hasUnsavedChanges = false
    },
    resetOperationStatus: (state) => {
      state.operationStatus = initialState.operationStatus
    },
    resetVetState: () => initialState
  },
  extraReducers: (builder) => {
    // Handle getVet query
    builder
      .addMatcher(vetApi.endpoints.getVet.matchPending, () => {
        // Optional: Add loading state if needed
      })
      .addMatcher(vetApi.endpoints.getVet.matchFulfilled, (state, action) => {
        // Update last updated timestamp
        state.lastUpdated = new Date().toISOString()

        // If vet data exists, save it as form snapshot
        if (action.payload.vet) {
          state.formState.lastSavedData = action.payload.vet
          state.selectedVetId = action.payload.vet.id
        }

        // Auto-enable editing if no vet exists
        if (!action.payload.hasVet) {
          state.isEditingVet = true
        }
      })

    // Handle createVet mutation
    builder
      .addMatcher(vetApi.endpoints.createVet.matchPending, (state) => {
        state.operationStatus.isCreating = true
        state.operationStatus.lastOperation = 'create'
        state.operationStatus.lastOperationSuccess = false
      })
      .addMatcher(vetApi.endpoints.createVet.matchFulfilled, (state, action) => {
        state.operationStatus.isCreating = false
        state.operationStatus.lastOperationSuccess = true
        state.lastUpdated = new Date().toISOString()

        // Update form state
        state.formState.lastSavedData = action.payload.user.vet
        state.formState.isDirty = false
        state.formState.hasUnsavedChanges = false
        state.selectedVetId = action.payload.user.vet.id

        // Exit editing mode after successful creation
        state.isEditingVet = false
      })
      .addMatcher(vetApi.endpoints.createVet.matchRejected, (state) => {
        state.operationStatus.isCreating = false
        state.operationStatus.lastOperationSuccess = false
      })

    // Handle updateVet mutation
    builder
      .addMatcher(vetApi.endpoints.updateVet.matchPending, (state) => {
        state.operationStatus.isUpdating = true
        state.operationStatus.lastOperation = 'update'
        state.operationStatus.lastOperationSuccess = false
      })
      .addMatcher(vetApi.endpoints.updateVet.matchFulfilled, (state, action) => {
        state.operationStatus.isUpdating = false
        state.operationStatus.lastOperationSuccess = true
        state.lastUpdated = new Date().toISOString()

        // Update form state
        state.formState.lastSavedData = action.payload.vet
        state.formState.isDirty = false
        state.formState.hasUnsavedChanges = false

        // Exit editing mode after successful update
        state.isEditingVet = false
      })
      .addMatcher(vetApi.endpoints.updateVet.matchRejected, (state) => {
        state.operationStatus.isUpdating = false
        state.operationStatus.lastOperationSuccess = false
      })

    // Handle deleteVet mutation
    builder
      .addMatcher(vetApi.endpoints.deleteVet.matchPending, (state) => {
        state.operationStatus.isDeleting = true
        state.operationStatus.lastOperation = 'delete'
        state.operationStatus.lastOperationSuccess = false
      })
      .addMatcher(vetApi.endpoints.deleteVet.matchFulfilled, (state) => {
        state.operationStatus.isDeleting = false
        state.operationStatus.lastOperationSuccess = true
        state.lastUpdated = new Date().toISOString()

        // Reset form and selection state
        state.formState.lastSavedData = null
        state.formState.isDirty = false
        state.formState.hasUnsavedChanges = false
        state.selectedVetId = null

        // Enable editing mode since no vet exists now
        state.isEditingVet = true
      })
      .addMatcher(vetApi.endpoints.deleteVet.matchRejected, (state) => {
        state.operationStatus.isDeleting = false
        state.operationStatus.lastOperationSuccess = false
      })
  }
})

export const {
  setEditingVet,
  setSelectedVetId,
  setVetSearchQuery,
  setVetFilters,
  updatePreferences,
  setFormDirty,
  saveFormSnapshot,
  resetOperationStatus,
  resetVetState
} = vetSlice.actions

export const vetReducer = vetSlice.reducer

// Selectors for easy access to state
export const selectVetState = (state: { vet: VetState }) => state.vet
export const selectIsEditingVet = (state: { vet: VetState }) => state.vet?.isEditingVet
export const selectVetOperationStatus = (state: { vet: VetState }) => state.vet?.operationStatus
export const selectVetFormState = (state: { vet: VetState }) => state.vet?.formState
export const selectVetPreferences = (state: { vet: VetState }) => state.vet?.preferences
export const selectHasUnsavedChanges = (state: { vet: VetState }) => state.vet?.formState.hasUnsavedChanges
