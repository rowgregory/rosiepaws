import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface DashboardStatePayload {
  loading: boolean
  navigationDrawer: boolean
  modal: boolean
  modalContent: null
  drawer: boolean
  drawerContent: object | null
  error: string
  bottomOverlayDrawer: boolean
  isUpdating: boolean
  type: string
  notificationDrawer: boolean
}

const initialDashboardState: DashboardStatePayload = {
  loading: false,
  navigationDrawer: false,
  modal: false,
  modalContent: null,
  drawer: false,
  drawerContent: null,
  error: '',
  bottomOverlayDrawer: false,
  isUpdating: false,
  type: '',
  notificationDrawer: false
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialDashboardState,
  reducers: {
    openNavigationDrawer: (state) => {
      state.navigationDrawer = true
    },
    closeNavigationDrawer: (state) => {
      state.navigationDrawer = false
    },
    openCreateModal: (state) => {
      state.modal = true
    },
    openUpdateModal: (state, { payload }) => {
      state.modal = true
      state.modalContent = payload
    },
    closeModal: (state) => {
      state.modal = false
      state.modalContent = null
    },
    openViewDrawer: (state) => {
      state.drawer = true
    },
    openCreateDrawer: (state) => {
      state.drawer = true
    },
    openUpdateDrawer: (state) => {
      state.drawer = true
      state.isUpdating = true
    },
    closeDrawer: (state) => {
      state.drawer = false
      state.isUpdating = false
    },
    openBottomOverlayDrawer: (state, { payload }) => {
      state.bottomOverlayDrawer = true
      state.type = payload
    },
    closeBottomOverlayDrawer: (state) => {
      state.bottomOverlayDrawer = false
    },

    resetDashboardError: (state) => {
      state.error = ''
    },
    setDashboardError: (state, { payload }) => {
      state.error = payload
    },
    setOpenNotificationDrawer: (state) => {
      state.notificationDrawer = true
    },
    setCloseNotificationDrawer: (state) => {
      state.notificationDrawer = false
    }
  }
})

export const dashboardReducer = dashboardSlice.reducer as Reducer<DashboardStatePayload>

export const {
  openNavigationDrawer,
  closeNavigationDrawer,
  openCreateModal,
  openUpdateModal,
  closeModal,
  openCreateDrawer,
  openUpdateDrawer,
  closeDrawer,
  resetDashboardError,
  openBottomOverlayDrawer,
  closeBottomOverlayDrawer,
  openViewDrawer,
  setDashboardError,
  setOpenNotificationDrawer,
  setCloseNotificationDrawer
} = dashboardSlice.actions
