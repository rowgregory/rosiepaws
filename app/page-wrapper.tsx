'use client'

import React, { FC, ReactNode, useEffect } from 'react'
import Header from './components/header/Header'
import useSyncUserToRedux from './hooks/useSyncUserToRedux'
import useCustomPathname from './hooks/useCustomPathname'
import Footer from './components/footer/Footer'
import AdminConfirmModal from './modals/AdminConfirmModal'
import { setPainScores } from './redux/features/painSlice'
import { setFeedings } from './redux/features/feedingSlice'
import { setWaters } from './redux/features/waterSlice'
import { setVitalSigns } from './redux/features/vitalSignsSlice'
import { setMovements } from './redux/features/movementSlice'
import { setMedications } from './redux/features/medicationSlice'
import { setAppointments } from './redux/features/appointmentSlice'
import { setBloodSugars } from './redux/features/bloodSugarSlice'
import { setSeizures } from './redux/features/seizureSlice'
import { setGalleryItems } from './redux/features/galleryItemSlice'
import { IFeeding, IUser, PainScore, Pet } from './types'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from './redux/store'
import { useFetchMeQuery } from './redux/services/userApi'
import { clearUser, setTokenTransactions, setUser } from './redux/features/userSlice'
import {
  setChartData,
  setPet,
  setPets,
  setPetStats,
  setPetsWithNoLogs,
  setSelectedPetWithChartData
} from './redux/features/petSlice'

interface IFetchMe {
  data: {
    user: IUser
    pets: Pet[]
    pet: Pet
    feedings: IFeeding[]
    tokenTransactions: any[]
    painScores: PainScore[]
    stats: any[]
    chartData: any
    noLogs: boolean
    petsWithNoLogs: any[]
    waters: any[]
    vitalSigns: any[]
    movements: any[]
    medications: any[]
    appointments: any[]
    bloodSugars: any[]
    seizures: any[]
  }
  isLoading: boolean
}

const PageWrapper: FC<{ children: ReactNode; user: any }> = ({ children, user }) => {
  const path = useCustomPathname()
  useSyncUserToRedux(user)
  const { status } = useSession()
  const dispatch = useAppDispatch()
  const { data } = useFetchMeQuery(undefined) as IFetchMe

  const hide = ['/guardian', '/auth/login', '/admin', '/buy', '/support'].some((item) => path.includes(item))

  useEffect(() => {
    if (status === 'authenticated' && data?.user) {
      dispatch(setUser(data.user))
      dispatch(setTokenTransactions(data?.tokenTransactions))
      dispatch(setPets(data?.pets))
      dispatch(setPet(data?.pets[0]))
      dispatch(setPetStats(data?.stats))
      dispatch(setPetsWithNoLogs(data?.petsWithNoLogs))
      dispatch(setChartData(data?.chartData))
      dispatch(setPainScores(data?.painScores))
      dispatch(setFeedings(data?.feedings))
      dispatch(setWaters(data?.waters))
      dispatch(setVitalSigns(data?.vitalSigns))
      dispatch(setMovements(data?.movements))
      dispatch(setMedications(data?.medications))
      dispatch(setAppointments(data?.appointments))
      dispatch(setBloodSugars(data?.bloodSugars))
      dispatch(setSeizures(data?.seizures))
      dispatch(setGalleryItems(data?.user?.galleryItems))
      dispatch(setSelectedPetWithChartData({ stats: data?.stats, chartData: data.chartData, pet: data.pets[0] }))
    } else if (status === 'unauthenticated') {
      dispatch(clearUser())
    }
  }, [data, status, dispatch])

  return (
    <>
      <AdminConfirmModal />
      {!hide && <Header />}
      {children}
      {!hide && <Footer />}
    </>
  )
}

export default PageWrapper
