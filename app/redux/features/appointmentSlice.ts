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
  appointmentCreateDrawer: boolean
  appointmentUpdateDrawer: boolean
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
  appointmentCreateDrawer: false,
  appointmentUpdateDrawer: false,
  appointmentCount: 0
}

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: initialAppointmentState,
  reducers: {
    setOpenAppointmentCreateDrawer: (state) => {
      state.appointmentCreateDrawer = true
    },
    setCloseAppointmentCreateDrawer: (state) => {
      state.appointmentCreateDrawer = false
    },
    setOpenAppointmentUpdateDrawer: (state) => {
      state.appointmentUpdateDrawer = true
    },
    setCloseAppointmentUpdateDrawer: (state) => {
      state.appointmentUpdateDrawer = false
    },
    addAppointmentsToState: (state, { payload }) => {
      state.appointments = payload
      state.zeroAppointments = payload.length === 0
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
  setOpenAppointmentCreateDrawer,
  setCloseAppointmentCreateDrawer,
  setOpenAppointmentUpdateDrawer,
  setCloseAppointmentUpdateDrawer,
  addAppointmentsToState
} = appointmentSlice.actions
