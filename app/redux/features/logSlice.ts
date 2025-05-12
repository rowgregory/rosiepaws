import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface LogStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  logs: []
  log: object
}

export const initialLogState: LogStatePayload = {
  loading: true,
  success: false,
  error: '',
  message: '',
  logs: [],
  log: {}
}

interface ErrorPayload {
  data: {
    message: string
    sliceName: string
  }
}

export const logSlice = createSlice({
  name: 'log',
  initialState: initialLogState,
  reducers: {
    setLogs: (state, { payload }) => {
      state.logs = payload
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is { type: string; payload: ErrorPayload } =>
        action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'logApi',
      (state, { payload }) => {
        state.loading = false
        state.error = payload.data.message
      }
    )
  }
})

export const logReducer = logSlice.reducer as Reducer<LogStatePayload>

export const { setLogs } = logSlice.actions
