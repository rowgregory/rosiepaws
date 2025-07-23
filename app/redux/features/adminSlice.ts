import { Reducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { adminApi } from '../services/adminApi'
import { IStripeSubscription, IUser, Pet } from '@/app/types/entities'
import { petInitialState } from '@/app/lib/initial-states/pet'
import { initialStripeSubscriptionState } from '@/app/lib/initial-states/stripe-subscription'

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

interface DashboardSummaryData {
  totalUsers: number
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
  pet: Pet
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
}

const initialConfirmModal = {
  isOpen: false,
  title: '',
  description: '',
  confirmText: '',
  onConfirm: () => {},
  isDestructive: false,
  isProcessing: false
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
  pet: petInitialState,
  zeroPets: false,
  petDrawer: false,
  petCount: 0,
  subscriptions: [],
  grossVolumeByMonth: 0,
  charts: {
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
  },
  summary: {
    totalUsers: 0,
    totalPets: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    averageRevenuePerUser: 0,
    petsPerUser: 0,
    tokenUtilizationRate: 0
  },
  adminManagePaymentDrawer: false,
  subscription: initialStripeSubscriptionState,
  adminConfirmModal: false,
  confirmModal: initialConfirmModal
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(adminApi.endpoints.fetchDashboardData.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.success = true
        state.subscriptions = payload.subscriptions
        state.users = payload.users
        state.pets = payload.pets
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
      })
      .addMatcher(adminApi.endpoints.fetchAllPets.matchFulfilled, (state, { payload }: any) => {
        state.pets = payload.pets
        state.loading = false
        state.zeroPets = payload.pets.length === 0
        state.petCount = payload.pets.length
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
  setCloseAdminConfirmModal
} = adminSlice.actions
