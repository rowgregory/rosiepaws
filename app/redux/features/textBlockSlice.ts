import { Reducer, createSlice } from '@reduxjs/toolkit'
import { textBlockApi } from '../services/textBlockApi'

export const initialTextBlockState = {
  textBlockMap: {},
  textBlockDeleted: false,
  success: false,
  loading: true,
  error: null,
  message: null,
  status: '',
  systemStatus: {},
  concerts: [],
  testimonials: [],
  photoGalleryImages: [],
  teamMembers: []
}

export const textBlockSlice = createSlice({
  name: 'textBlock',
  initialState: initialTextBlockState,
  reducers: {
    setTextBlocks: (state, { payload }: any) => {
      state.loading = false
      const combinedTextBlocks = {
        ...state.textBlockMap,
        ...payload
      }

      state.textBlockMap = combinedTextBlocks
    },
    updateTextBlockInState(state: any, action) {
      const { key, value, type } = action.payload
      state.textBlockMap[type] = { ...state.textBlockMap[type], [key]: value }
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(textBlockApi.endpoints.updateTextBlock.matchFulfilled, (state) => {
        state.success = true
        state.loading = false
      })
      .addMatcher(textBlockApi.endpoints.fetchTextBlocks.matchFulfilled, (state, { payload }: any) => {
        state.textBlockMap = {
          ...state.textBlockMap,
          ...payload.transformedTextBlocks
        }
      })
      .addMatcher(textBlockApi.endpoints.textBlockSystemStatus.matchFulfilled, (state, { payload }: any) => {
        state.loading = false
        state.message = payload.message
        state.status = payload.status
        state.systemStatus = payload.systemStatus
      })
      .addMatcher(
        (action: any) => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false
          state.error = action.payload?.data || 'An error occurred.'
        }
      )
  }
})

export const textBlockReducer = textBlockSlice.reducer as Reducer

export const { setTextBlocks, updateTextBlockInState } = textBlockSlice.actions
