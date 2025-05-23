'use client'

import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { api } from './services/api'
import { appReducer } from './features/appSlice'
import { authReducer } from './features/authSlice'
import { dashboardReducer } from './features/dashboardSlice'
import { textBlockReducer } from './features/textBlockSlice'
import { photoGalleryImageReducer } from './features/photoGalleryImageSlice'
import { userReducer } from './features/userSlice'
import { pushNotificationReducer } from './features/pushNotificationSlice'
import { logReducer } from './features/logSlice'
import { petReducer } from './features/petSlice'
import { formReducer } from './features/formSlice'

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  textBlock: textBlockReducer,
  photoGalleryImage: photoGalleryImageReducer,
  user: userReducer,
  pushNotification: pushNotificationReducer,
  log: logReducer,
  pet: petReducer,
  form: formReducer,
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
