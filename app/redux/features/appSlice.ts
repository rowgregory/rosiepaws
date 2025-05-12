import { Reducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appApi } from '../services/appApi'

export interface FetchDashboardDataQueryTypes {
  error: { data: { message: string } }
}

interface ModalUploaderPayload {
  show: boolean
  src: string
  type: string
  textBlockKey: string
  initialValue?: string
}

export interface AppStatePayload {
  loading: boolean
  success: boolean
  error: string | object | null
  navigationDrawer: boolean
  seatMap: boolean
  openModal: boolean
  drawer: boolean
  data: {
    show: boolean
    initialValue: string
    type: string
    textBlockKey: string
  }
  drawerData: {
    position: string
    firstName: string
    lastName: string
    imageUrl: string
    bio: string
    selectedIndex: number
  } | null
  photoGalleryImagesCount: number
  mediaData: ModalUploaderPayload
  usersCount: number
  openModalImageUploaderPublic: boolean
  selectedIndex: number
  logCount: number
  isOnline: boolean
  noUsers: boolean
}

const mediaDataInitialState: ModalUploaderPayload = {
  show: false,
  src: '',
  type: '',
  textBlockKey: '',
  initialValue: ''
}

const initialAppState: AppStatePayload = {
  loading: true,
  success: false,
  error: null,
  navigationDrawer: false,
  seatMap: false,
  openModal: false,
  drawer: false,
  data: {
    show: false,
    initialValue: '',
    type: '',
    textBlockKey: ''
  },
  drawerData: null,
  photoGalleryImagesCount: 0,
  usersCount: 0,
  mediaData: mediaDataInitialState,
  openModalImageUploaderPublic: false,
  selectedIndex: -1,
  logCount: 0,
  isOnline: true,
  noUsers: false
}

interface FetchAppDataPayload {
  photoGalleryImagesCount: number
}

interface FetchDashboardDataPayload {
  usersCount: number
  logCount: number
}

interface ErrorPayload {
  data: {
    sliceName: string
    message?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setIsOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
    openNavigationDrawer: (state) => {
      state.navigationDrawer = true
    },
    closeNavigationDrawer: (state) => {
      state.navigationDrawer = false
    },
    openSeatMap: (state) => {
      state.seatMap = true
    },
    closeSeatMap: (state) => {
      state.seatMap = false
    },
    setOpenModal: (state, action: PayloadAction<AppStatePayload['data']>) => {
      state.openModal = true
      state.data = action.payload
    },
    setCloseModal: (state) => {
      state.openModal = false
    },
    setOpenDrawer: (
      state,
      action: PayloadAction<{ teamMember: AppStatePayload['drawerData']; selectedIndex: number }>
    ) => {
      state.drawer = true
      state.drawerData = action.payload.teamMember
      state.selectedIndex = action.payload.selectedIndex
    },
    setCloseDrawer: (state) => {
      state.drawer = false
    },
    resetDrawerData: (state) => {
      state.drawerData = null
    },
    setOpenModalImageUploaderPublic: (state, action: PayloadAction<{ mediaData: ModalUploaderPayload }>) => {
      state.mediaData = action.payload.mediaData
      state.openModalImageUploaderPublic = true
    },
    setCloseModalImageUploaderPublic: (state) => {
      state.mediaData = mediaDataInitialState
      state.openModalImageUploaderPublic = false
    },
    increasePhotoGalleryImageCount: (state) => {
      state.photoGalleryImagesCount++
    },
    decreasePhotoGalleryImageCount: (state) => {
      state.photoGalleryImagesCount--
    },
    increaseUsersCount: (state) => {
      state.usersCount++
    },
    decreaseUsersCount: (state) => {
      state.usersCount--
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action): action is PayloadAction<FetchAppDataPayload> =>
          action.type === appApi.endpoints.fetchAppData.matchFulfilled,
        (state, action) => {
          state.success = true
          state.photoGalleryImagesCount = action.payload.photoGalleryImagesCount
          state.loading = false
        }
      )
      .addMatcher(
        (action): action is PayloadAction<FetchDashboardDataPayload> =>
          action.type === appApi.endpoints.fetchDashboardData.matchFulfilled,
        (state, action) => {
          state.success = true
          state.usersCount = action.payload.usersCount
          state.logCount = action.payload.logCount
          state.loading = false
        }
      )
      .addMatcher(
        (action): action is PayloadAction<ErrorPayload> =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'appApi',
        (state, action) => {
          state.loading = false
          state.error = action.payload?.data?.message || 'An error occurred.'
        }
      )
  }
})

export const appReducer = appSlice.reducer as Reducer<AppStatePayload>

export const {
  setIsOnline,
  openNavigationDrawer,
  closeNavigationDrawer,
  openSeatMap,
  closeSeatMap,
  setOpenModal,
  setCloseModal,
  setOpenModalImageUploaderPublic,
  setCloseModalImageUploaderPublic,
  setCloseDrawer,
  setOpenDrawer,
  resetDrawerData,
  increasePhotoGalleryImageCount,
  decreasePhotoGalleryImageCount,
  increaseUsersCount,
  decreaseUsersCount
} = appSlice.actions
