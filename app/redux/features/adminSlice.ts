import { Reducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { adminApi } from '../services/adminApi'
import { ILog, IStripeSubscription, ITicket, IUser, Pet } from '@/app/types/entities'
import { initialStripeSubscriptionState } from '@/app/lib/initial-states/stripe-subscription'
import { initialUserState } from '@/app/lib/initial-states/user'

interface ErrorPayload {
  data: {
    message: string
  }
}

interface DashboardChartData {
  revenueByMonth: Array<{ month: string; revenue: number; subscriptions: number }>
  planDistribution: Array<{ plan: string; count: number; percentage: number }>
  statusDistribution: Array<{ status: string; count: number; percentage: number }>
  userGrowth: Array<{ month: string; newUsers: number; totalUsers: number }>
  roleDistribution: Array<{ role: string; count: number; percentage: number }>
  petTypes: Array<{ type: string; count: number; percentage: number }>
  topBreeds: Array<{ breed: string; count: number }>
  petAges: Array<{ ageGroup: string; count: number; percentage: number }>
  tokenUsage: Array<{ name: string; value: number; color: string }>
  userTypes: Array<{ type: string; count: number; percentage: number }>
  paymentMethods: Array<{ method: string; count: number; percentage: number }>
  mrrByPlan: Array<{ plan: string; mrr: number }>
}

export interface DashboardSummaryData {
  totalUsers: number
  freeUsers: number
  comfortUsers: number
  legacyUsers: number
  totalPets: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalRevenue: number
  averageRevenuePerUser: number
  petsPerUser: number
  tokenUtilizationRate: number
}

interface IConfirmModal {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  onConfirm: any
  isDestructive: boolean
  isProcessing: boolean
  tokenAmount: string | number
}

interface IAdminPet {
  filePath: any
  id: string
  name: string
  type: string
  breed: string
  age: string
  gender: string
  weight: string
  spayedNeutered: string
  microchipId?: string
  allergies?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  lastVisit?: string
  nextVisit?: string
  notes?: string
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    name?: string
    email: string
  }
  _count?: {
    painScores: number
    appointments: number
    medications: number
    feedings: number
    seizures: number
    waters: number
    bloodSugars: number
    vitalSigns: number
    galleryItems: number
    movements: number
  }
  // Recent activity samples
  painScores?: any[]
  medications?: any[]
  feedings?: any[]
  waters?: any[]
  vitalSigns?: any[]
  movements?: any[]
}

export interface AdminStatePayload {
  loading: boolean
  success: boolean
  error: string
  message: string | null
  grossVolume: number | string
  zeroUsers: number
  users: IUser[]
  actionMenu: boolean
  pets: Pet[]
  pet: IAdminPet
  logs: ILog[]
  zeroPets: boolean
  petDrawer: boolean
  petCount: number
  subscriptions: IStripeSubscription[]
  grossVolumeByMonth: number
  charts: DashboardChartData
  summary: DashboardSummaryData
  adminManagePaymentDrawer: boolean
  subscription: IStripeSubscription
  adminConfirmModal: boolean
  confirmModal: IConfirmModal
  settings: { backupFrequency: string }
  manageTokensDrawer: boolean
  user: any
  customerDetailsDrawer: boolean
  petDetailsDrawer: boolean
  tickets: ITicket[]
  adminMobileNavigation: boolean
}

const initialConfirmModal = {
  isOpen: false,
  title: '',
  description: '',
  confirmText: '',
  onConfirm: () => {},
  isDestructive: false,
  isProcessing: false,
  tokenAmount: ''
}

const summaryInitialState = {
  totalUsers: 0,
  freeUsers: 0,
  comfortUsers: 0,
  legacyUsers: 0,
  totalPets: 0,
  totalSubscriptions: 0,
  activeSubscriptions: 0,
  totalRevenue: 0,
  averageRevenuePerUser: 0,
  petsPerUser: 0,
  tokenUtilizationRate: 0
}

const chartsInitialState = {
  revenueByMonth: [],
  planDistribution: [],
  statusDistribution: [],
  userGrowth: [],
  roleDistribution: [],
  petTypes: [],
  topBreeds: [],
  petAges: [],
  tokenUsage: [],
  userTypes: [],
  paymentMethods: [],
  mrrByPlan: []
}

const initialAdminPetState = {
  id: '',
  name: '',
  type: '',
  breed: '',
  age: '',
  gender: '',
  weight: '',
  spayedNeutered: '',
  microchipId: undefined,
  allergies: undefined,
  emergencyContactName: undefined,
  emergencyContactPhone: undefined,
  lastVisit: undefined,
  nextVisit: undefined,
  notes: undefined,
  createdAt: '',
  updatedAt: '',
  owner: {
    id: '',
    name: undefined,
    email: ''
  },
  _count: {
    painScores: 0,
    appointments: 0,
    medications: 0,
    feedings: 0,
    seizures: 0,
    waters: 0,
    bloodSugars: 0,
    vitalSigns: 0,
    galleryItems: 0,
    movements: 0
  },
  painScores: [],
  medications: [],
  feedings: [],
  waters: [],
  vitalSigns: [],
  movements: [],
  filePath: ''
}

export const initialAdminState: AdminStatePayload = {
  loading: true,
  success: false,
  error: '',
  message: '',
  grossVolume: '',
  zeroUsers: 0,
  users: [],
  actionMenu: false,
  pets: [],
  logs: [],
  pet: initialAdminPetState,
  zeroPets: false,
  petDrawer: false,
  petCount: 0,
  subscriptions: [],
  grossVolumeByMonth: 0,
  charts: chartsInitialState,
  summary: summaryInitialState,
  adminManagePaymentDrawer: false,
  subscription: initialStripeSubscriptionState,
  adminConfirmModal: false,
  confirmModal: initialConfirmModal,
  settings: { backupFrequency: '' },
  manageTokensDrawer: false,
  user: initialUserState,
  customerDetailsDrawer: false,
  petDetailsDrawer: false,
  tickets: [],
  adminMobileNavigation: false
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    setOpenAdminActionMenu: (state) => {
      state.actionMenu = true
    },
    setCloseAdminActionMenu: (state) => {
      state.actionMenu = false
    },
    setOpenAdminManagePaymentDrawer: (state, { payload }) => {
      state.adminManagePaymentDrawer = true
      state.subscription = payload.subscription
    },
    setCloseAdminManagePaymentDrawer: (state) => {
      state.adminManagePaymentDrawer = false
    },
    setOpenAdminConfirmModal: (state, { payload }) => {
      state.adminConfirmModal = true
      state.confirmModal = payload.confirmModal
    },
    setCloseAdminConfirmModal: (state) => {
      state.adminConfirmModal = false
      state.confirmModal = initialConfirmModal
    },
    updateBackupFrequency: (state, { payload }: any) => {
      state.settings.backupFrequency = payload
    },
    setOpenManageTokensDrawer: (state, { payload }) => {
      state.manageTokensDrawer = true
      state.user = payload
    },
    setCloseManageTokensDrawer: (state) => {
      state.manageTokensDrawer = false
    },
    updateUserInUsers: (state, { payload }: any) => {
      const userIndex = state.users.findIndex((user) => user.id === payload.id)
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...payload }
        state.user.tokens = payload.tokens
        state.user.tokensUsed = payload.tokensUsed
      }
    },
    addTokenTransactionToUser: (state, { payload }) => {
      const { userId, transaction } = payload

      const userIndex = state.users.findIndex((user) => user.id === userId)
      if (userIndex !== -1) {
        if (!state.users[userIndex].tokenTransactions) {
          state.users[userIndex].tokenTransactions = []
        }
        // Add new transaction at the beginning (most recent first)
        state.users[userIndex].tokenTransactions.unshift(transaction)
        state.user.tokenTransactions = [transaction, ...state.user.tokenTransactions]
      }
    },
    setOpenCustomerDetailsDrawer: (state, { payload }) => {
      state.customerDetailsDrawer = true
      state.user = payload
    },
    setCloseCustomerDetailsDrawer: (state) => {
      state.customerDetailsDrawer = false
    },
    setOpenPetDetailsDrawer: (state, { payload }) => {
      state.petDetailsDrawer = true
      state.pet = payload
    },
    setClosePetDetailsDrawer: (state) => {
      state.petDetailsDrawer = false
    },
    setOpenAdminMobileNavigation: (state) => {
      state.adminMobileNavigation = true
    },
    setCloseAdminMobileNavigation: (state) => {
      state.adminMobileNavigation = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(adminApi.endpoints.fetchAdminDashboardData.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.success = true
        state.subscriptions = payload.subscriptions
        state.users = payload.users
        state.pets = payload.pets
        state.logs = payload.logs
        state.tickets = payload.tickets
        state.charts = {
          revenueByMonth: payload.charts.revenueByMonth,
          planDistribution: payload.charts.planDistribution,
          statusDistribution: payload.charts.statusDistribution,
          userGrowth: payload.charts.userGrowth,
          roleDistribution: payload.charts.roleDistribution,
          petTypes: payload.charts.petTypes,
          topBreeds: payload.charts.topBreeds,
          petAges: payload.charts.petAges,
          tokenUsage: payload.charts.tokenUsage,
          userTypes: payload.charts.userTypes,
          paymentMethods: payload.charts.paymentMethods,
          mrrByPlan: payload.charts.mrrByPlan
        }
        state.summary = payload.summary
        state.settings.backupFrequency = payload.frequency
      })
      .addMatcher(adminApi.endpoints.updateBackupFrequency.matchFulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addMatcher(adminApi.endpoints.updateBackupFrequency.matchFulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addMatcher(
        (action): action is PayloadAction<ErrorPayload> =>
          action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'adminApi',
        (state, action) => {
          state.loading = false
          state.error = action.payload.data?.message
        }
      )
  }
})

export const adminReducer = adminSlice.reducer as Reducer<AdminStatePayload>

export const {
  setOpenAdminActionMenu,
  setCloseAdminActionMenu,
  setOpenAdminManagePaymentDrawer,
  setCloseAdminManagePaymentDrawer,
  setOpenAdminConfirmModal,
  setCloseAdminConfirmModal,
  updateBackupFrequency,
  setOpenManageTokensDrawer,
  setCloseManageTokensDrawer,
  updateUserInUsers,
  addTokenTransactionToUser,
  setOpenCustomerDetailsDrawer,
  setCloseCustomerDetailsDrawer,
  setOpenPetDetailsDrawer,
  setClosePetDetailsDrawer,
  setOpenAdminMobileNavigation,
  setCloseAdminMobileNavigation
} = adminSlice.actions
