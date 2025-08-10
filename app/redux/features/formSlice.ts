import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChangeEvent } from 'react'
import { petInitialState } from '@/app/lib/initial-states/pet'
import { painScoreInitialErrorState, painScoreInitialState } from '@/app/lib/initial-states/pain-score'
import { feedingInitialState } from '@/app/lib/initial-states/feeding'
import { bloodSugarInitialState } from '@/app/lib/initial-states/bloodSugar'
import { waterInitialState } from '@/app/lib/initial-states/water'
import { medicationInitialErrorState, medicationInitialState } from '@/app/lib/initial-states/medication'
import { seizureInitialState } from '@/app/lib/initial-states/seizure'
import { appointmentInitialError, appointmentInitialState } from '@/app/lib/initial-states/appointment'
import { movementInitialErrorState, movementInitialState } from '@/app/lib/initial-states/movement'
import { vitalSignsInitialState } from '@/app/lib/initial-states/vital-signs'

export type Inputs = {
  [key: string]: string | number | boolean | undefined | unknown
}

export type Errors = {
  [key: string]: string
}

interface SetInputProps {
  formName: string
  data: any
}
interface SetErrorsProps {
  formName: string
  errors: Errors
}
interface SetSubmitttedProps {
  formName: string
  submitted: boolean
}
interface HandleInputProps {
  formName: string
  name: string
  value: any
}

const formInitialState = {
  isCreating: false,
  petForm: {
    inputs: petInitialState,
    errors: petInitialState
  },
  painForm: {
    inputs: painScoreInitialState,
    errors: painScoreInitialErrorState
  },
  feedingForm: {
    inputs: feedingInitialState,
    errors: feedingInitialState
  },
  bloodSugarForm: {
    inputs: bloodSugarInitialState,
    errors: bloodSugarInitialState
  },
  waterForm: {
    inputs: waterInitialState,
    errors: waterInitialState
  },
  medicationForm: {
    inputs: medicationInitialState,
    errors: medicationInitialErrorState
  },
  seizureForm: {
    inputs: seizureInitialState,
    errors: seizureInitialState
  },
  appointmentForm: {
    inputs: appointmentInitialState,
    errors: appointmentInitialError
  },
  movementForm: {
    inputs: movementInitialState,
    errors: movementInitialErrorState
  },
  ticketForm: {
    inputs: { category: '', priority: '', subject: '', email: '', description: '', deviceInfo: '', attachments: [] },
    errors: movementInitialState
  },
  settingsForm: {
    inputs: { backupFrequency: 'daily' },
    errors: { backupFrequency: '' }
  },
  mediaForm: {
    inputs: { uploadingFiles: [] },
    errors: {}
  },
  vitalSignsForm: {
    inputs: vitalSignsInitialState,
    errors: {}
  }
} as any

const formSlice = createSlice({
  name: 'form',
  initialState: formInitialState,
  reducers: {
    setIsCreating: (state) => {
      state.isCreating = true
    },
    setIsNotCreating: (state) => {
      state.isCreating = false
    },
    resetForm: (state, { payload }) => {
      if (state[payload] && state[payload].inputs !== undefined) {
        state[payload].inputs = null
        state[payload].errors = null
      }
    },
    setInputs: (state, { payload }: PayloadAction<SetInputProps>) => {
      const { formName, data } = payload
      if (!state[formName]) state[formName] = { inputs: {}, errors: {}, submitted: false }

      state[formName].inputs = { ...state[formName].inputs, ...data }
    },
    setErrors: (state, { payload }: PayloadAction<SetErrorsProps>) => {
      const { formName, errors } = payload
      if (!state[formName]) state[formName] = { inputs: {}, errors: {}, submitted: false }
      state[formName].errors = { ...state[formName].errors, ...errors }
    },
    clearInputs: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      state[formName].inputs = {}
      state[formName].errors = {}
    },
    clearErrors: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      state[formName].errors = {}
    },
    setSubmitted: (state, { payload }: PayloadAction<SetSubmitttedProps>) => {
      const { formName, submitted } = payload
      if (!state[formName]) return
      state[formName].submitted = submitted
    },
    handleInput: (state, action: PayloadAction<HandleInputProps>) => {
      const { formName, name, value } = action.payload

      const form = state[formName]

      let processedValue = value

      // Handle datetime-local inputs specially
      if (name === 'timeRecorded' && value && typeof value === 'string') {
        // Check if it's a datetime-local format (no Z at the end)
        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/) && !value.endsWith('Z')) {
          // Convert local datetime to UTC
          const localDate = new Date(value)
          processedValue = localDate.toISOString()
        }
      }

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: processedValue
        },
        errors: {
          ...form?.errors
        }
      }
    },
    handleSelect: (state, { payload }: PayloadAction<{ formName: string; name: string; value: string }>) => {
      const { formName, name, value } = payload
      if (!state[formName]) return
      state[formName].inputs[name] = value
    },
    handleToggle: (state, { payload }: PayloadAction<{ formName: string; name: string; checked: boolean }>) => {
      const { formName, name, checked } = payload
      const form = state[formName]

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: checked
        },
        errors: {
          ...form?.errors
        }
      }
    },
    handleFileUpload: (
      state,
      action: PayloadAction<{ formName: string; imageUrl: string | ArrayBuffer | null; file: File | null }>
    ) => {
      const { formName, imageUrl, file } = action.payload
      state[formName] = {
        ...state[formName],
        inputs: {
          ...state[formName]?.inputs,
          imageUrl,
          file
        }
      }
    },
    handleVideoUpload: (
      state,
      action: PayloadAction<{ formName: string; videoUrl: string | ArrayBuffer | null; videoFile: File | null }>
    ) => {
      const { formName, videoUrl, videoFile } = action.payload
      state[formName] = {
        ...state[formName],
        inputs: {
          ...state[formName]?.inputs,
          videoUrl,
          videoFile
        }
      }
    },
    setUploadProgress: (state, { payload }: any) => {
      state.progress = payload
      if ((state.progress = 100)) {
        state.progress = -1
      }
    }
  }
})

export const createFormActions = (formName: string, dispatch: any) => ({
  setInputs: (data: any) => dispatch(formSlice.actions.setInputs({ formName, data })),
  clearInputs: () => dispatch(formSlice.actions.clearInputs({ formName })),
  setErrors: (errors: Errors) => dispatch(formSlice.actions.setErrors({ formName, errors })),
  setSubmitted: (submitted: boolean) => dispatch(formSlice.actions.setSubmitted({ formName, submitted })),
  handleInput: (e: any) =>
    dispatch(formSlice.actions.handleInput({ formName, name: e.target.name, value: e.target.value })),
  handleSelect: (e: any) =>
    dispatch(formSlice.actions.handleSelect({ formName, name: e.target.name, value: e.target.value })),
  handleToggle: (e: any) =>
    dispatch(formSlice.actions.handleToggle({ formName, name: e.target.name, checked: e.target.checked })),
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0] && files[0].type.startsWith('image/') && !files[0].type.startsWith('image/heic')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(formSlice.actions.handleFileUpload({ formName, imageUrl: reader.result, file: files[0] }))
      }
      reader.readAsDataURL(files[0])
    }
  },
  handleVideoChange: (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0] && files[0].type.startsWith('video/')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(formSlice.actions.handleVideoUpload({ formName, videoUrl: reader.result, videoFile: files[0] }))
      }
      reader.readAsDataURL(files[0])
    }
  },
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => {
    const files = event.dataTransfer.files
    if (files && files[0] && files[0].type.startsWith('image/') && !files[0].type.startsWith('image/heic')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(formSlice.actions.handleFileUpload({ formName, imageUrl: reader.result, file: files[0] }))
      }
      reader.readAsDataURL(files[0])
    }
  },

  handleVideoDrop: (event: React.DragEvent<HTMLDivElement>) => {
    const files = event.dataTransfer.files
    if (files && files[0] && files[0].type.startsWith('video/')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(formSlice.actions.handleVideoUpload({ formName, videoUrl: reader.result, videoFile: files[0] }))
      }
      reader.readAsDataURL(files[0])
    }
  },
  handleUploadProgress: (progress: any) => dispatch(formSlice.actions.setUploadProgress(progress))
})

export const { resetForm, setIsCreating, setIsNotCreating, setInputs, setErrors, clearInputs, clearErrors } =
  formSlice.actions
export const formReducer = formSlice.reducer
