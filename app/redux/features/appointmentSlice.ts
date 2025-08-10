import { IAppointment } from '@/app/types/entities'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { appointmentInitialState } from '@/app/lib/initial-states/appointment'
import { appointmentApi } from '../services/appointmentApi'
import { ErrorPayload } from '@/app/types'

export interface AppointmentStatePayload {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  appointments: IAppointment[]
  appointment: IAppointment
  zeroAppointments: boolean
  appointmentDrawer: boolean
  appointmentCount: number
}

export const initialAppointmentState: AppointmentStatePayload = {
  loading: false,
  success: false,
  error: '',
  message: '',
  appointments: [],
  appointment: appointmentInitialState,
  zeroAppointments: true,
  appointmentDrawer: false,
  appointmentCount: 0
}

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: initialAppointmentState,
  reducers: {
    setOpenAppointmentDrawer: (state) => {
      state.appointmentDrawer = true
    },
    setCloseAppointmentDrawer: (state) => {
      state.appointmentDrawer = false
    },
    setAppointments: (state, { payload }) => {
      state.appointments = payload
      state.zeroAppointments = payload.length === 0
    },
    addAppointmentToState: (state, { payload }) => {
      state.appointments.unshift(payload)
      state.zeroAppointments = state.appointments.length === 0
    },
    updateAppointmentInState: (state, action) => {
      const { findById, replaceWith, ...updatedAppointment } = action.payload

      if (findById && replaceWith) {
        // Special case: find by one ID, replace with different data
        const index = state.appointments.findIndex((appointment) => appointment?.id === findById)
        if (index !== -1) {
          state.appointments[index] = replaceWith
        }
      } else {
        // Normal update
        const index = state.appointments.findIndex((appointment) => appointment?.id === updatedAppointment?.id)
        if (index !== -1) {
          state.appointments[index] = updatedAppointment
        }
      }
    },
    removeAppointmentFromState: (state, action) => {
      state.appointments = state.appointments.filter(
        (appointment: { id: string }) => appointment?.id !== action.payload
      )
      state.appointmentCount = state.appointmentCount - 1
      state.zeroAppointments = state.appointments.length === 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(appointmentApi.endpoints.createAppointment.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(appointmentApi.endpoints.createAppointment.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(appointmentApi.endpoints.updateAppointment.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(appointmentApi.endpoints.updateAppointment.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(appointmentApi.endpoints.deleteAppointment.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(appointmentApi.endpoints.deleteAppointment.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(
        (action): action is { type: string; payload: ErrorPayload } =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'appointmentApi',
        (state, { payload }) => {
          state.loading = false
          state.success = false
          state.error = payload.data.message
        }
      )
  }
})

export const appointmentReducer = appointmentSlice.reducer as Reducer<AppointmentStatePayload>

export const {
  addAppointmentToState,
  removeAppointmentFromState,
  setAppointments,
  setCloseAppointmentDrawer,
  setOpenAppointmentDrawer,
  updateAppointmentInState
} = appointmentSlice.actions
