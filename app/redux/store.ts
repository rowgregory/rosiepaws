'use client'

import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { api } from './services/api'
import { appReducer } from './features/appSlice'
import { dashboardReducer } from './features/dashboardSlice'
import { userReducer } from './features/userSlice'
import { logReducer } from './features/logSlice'
import { petReducer } from './features/petSlice'
import { formReducer } from './features/formSlice'
import { stripeReducer } from './features/stripeSlice'
import { adminReducer } from './features/adminSlice'
import { ticketReducer } from './features/ticketSlice'
import { painScoreReducer } from './features/painScoreSlice'
import { feedingReducer } from './features/feedingSlice'
import { waterReducer } from './features/waterSlice'
import { walkReducer } from './features/walkSlice'
import { movementReducer } from './features/movementSlice'
import { appointmentReducer } from './features/appointmentSlice'
import { medicationReducer } from './features/medicationSlice'
import { bloodSugarReducer } from './features/bloodSugarSlice'
import { seizureReducer } from './features/seizureSlice'
import { mediaReducer } from './features/mediaSlice'

const rootReducer = combineReducers({
  app: appReducer,
  dashboard: dashboardReducer,
  user: userReducer,
  log: logReducer,
  pet: petReducer,
  form: formReducer,
  stripe: stripeReducer,
  admin: adminReducer,
  ticket: ticketReducer,
  painScore: painScoreReducer,
  feeding: feedingReducer,
  water: waterReducer,
  walk: walkReducer,
  movement: movementReducer,
  appointment: appointmentReducer,
  medication: medicationReducer,
  bloodSugar: bloodSugarReducer,
  seizure: seizureReducer,
  media: mediaReducer,
  [api.reducerPath]: api.reducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppSelector = typeof store.getState

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
