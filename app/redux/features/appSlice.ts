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
  subsctiptionModal: boolean
  updateSubscriptionModal: boolean
  userDropdown: boolean
  support24Drawer: boolean
  disabilityEndOfLifeCareDrawer: boolean
  viewGuideDrawer: boolean
  contactSupportDrawer: boolean
  authErrorDrawer: boolean
  slideMessage: boolean
  hasInitiallyLoaded: boolean
  lastTempId: string
  firstPetModal: boolean
  petName: string // For FirstPetModal
  notEnoughTokensModal: boolean
  tokensNeeded: number
  accessibility: boolean
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
  noUsers: false,
  subsctiptionModal: false,
  updateSubscriptionModal: false,
  userDropdown: false,
  support24Drawer: false,
  disabilityEndOfLifeCareDrawer: false,
  viewGuideDrawer: false,
  contactSupportDrawer: false,
  authErrorDrawer: false,
  slideMessage: false,
  hasInitiallyLoaded: false,
  lastTempId: '',
  firstPetModal: false,
  petName: '',
  notEnoughTokensModal: false,
  tokensNeeded: 0,
  accessibility: false
}

interface FetchAppDataPayload {
  photoGalleryImagesCount: number
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
    },
    setOpenSubscriptionModal: (state) => {
      state.subsctiptionModal = true
    },
    setCloseSubscriptionModal: (state) => {
      state.subsctiptionModal = false
    },
    setOpenUpdateSubscriptionModal: (state) => {
      state.updateSubscriptionModal = true
    },
    setClosepdateSubscriptionModal: (state) => {
      state.updateSubscriptionModal = false
    },
    setOpenUserDropdown: (state) => {
      state.userDropdown = true
    },
    setCloseUserDropdown: (state) => {
      state.userDropdown = false
    },
    setOpenSupport24Dropdown: (state) => {
      state.support24Drawer = true
    },
    setCloseSupport24Dropdown: (state) => {
      state.support24Drawer = false
    },
    setOpenDisabilityEndOfLifeCareDrawer: (state) => {
      state.disabilityEndOfLifeCareDrawer = true
    },
    setCloseDisabilityEndOfLifeCareDrawer: (state) => {
      state.disabilityEndOfLifeCareDrawer = false
    },
    setOpenViewGuideDrawer: (state) => {
      state.viewGuideDrawer = true
    },
    setCloseViewGuideeDrawer: (state) => {
      state.viewGuideDrawer = false
    },
    setOpenContactSupportDrawer: (state) => {
      state.contactSupportDrawer = true
    },
    setCloseContactSupporteDrawer: (state) => {
      state.contactSupportDrawer = false
    },
    setOpenAuthErrorDrawer: (state) => {
      state.authErrorDrawer = true
    },
    setCloseAuthErrorDrawer: (state) => {
      state.authErrorDrawer = false
    },
    setOpenSlideMessage: (state) => {
      state.slideMessage = true
    },
    setCloseSlideMessage: (state) => {
      state.slideMessage = false
    },
    setInitiallyLoaded: (state) => {
      state.hasInitiallyLoaded = true
    },
    setLastTempId: (state, action) => {
      state.lastTempId = action.payload
    },
    setOpenFirstPetModal: (state, { payload }) => {
      state.firstPetModal = true
      state.petName = payload
    },
    setCloseFirstPetModal: (state) => {
      state.firstPetModal = false
    },
    setOpenNotEnoughTokensModal: (state, { payload }) => {
      state.notEnoughTokensModal = true
      state.tokensNeeded = payload
    },
    setCloseNotEnoughTokensModal: (state) => {
      state.notEnoughTokensModal = false
    },
    setToggleAccessibilityDrawer: (state, { payload }) => {
      state.accessibility = !payload
    },
    setCloseAccessibilityDrawer: (state) => {
      state.accessibility = false
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
  decreaseUsersCount,
  setOpenSubscriptionModal,
  setCloseSubscriptionModal,
  setOpenUpdateSubscriptionModal,
  setClosepdateSubscriptionModal,
  setOpenUserDropdown,
  setCloseUserDropdown,
  setOpenSupport24Dropdown,
  setCloseSupport24Dropdown,
  setOpenDisabilityEndOfLifeCareDrawer,
  setCloseDisabilityEndOfLifeCareDrawer,
  setOpenViewGuideDrawer,
  setCloseViewGuideeDrawer,
  setOpenContactSupportDrawer,
  setCloseContactSupporteDrawer,
  setOpenAuthErrorDrawer,
  setCloseAuthErrorDrawer,
  setOpenSlideMessage,
  setCloseSlideMessage,
  setInitiallyLoaded,
  setLastTempId,
  setOpenFirstPetModal,
  setCloseFirstPetModal,
  setOpenNotEnoughTokensModal,
  setCloseNotEnoughTokensModal,
  setToggleAccessibilityDrawer,
  setCloseAccessibilityDrawer
} = appSlice.actions
