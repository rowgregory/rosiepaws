'use client'

import React, { FC, useEffect } from 'react'
import { IChildren } from '../types/common'
import GuardianNavigation from '../components/guardian/GuardianNavigation'
// import GuardianToolbar from '../components/guardian/GuardianToolbar'
import GuardianActionMenu from '../components/guardian/GuardianActionMenu'
import MedicationDrawer from '../drawers/guardian/MedicationDrawer'
import NotificationDrawer from '../drawers/general/NotificationDrawer'
import PetDrawer from '../drawers/guardian/PetDrawer'
import WaterDrawer from '../drawers/guardian/WaterDrawer'
import MovementDrawer from '../drawers/guardian/MovementDrawer'
import BloodSugarDrawer from '../drawers/guardian/BloodSugarDrawer'
import SeizureDrawer from '../drawers/guardian/SeizureDrawer'
import VitalSignsDrawer from '../drawers/guardian/VitalSignsDrawer'
import { useFetchMeQuery } from '../redux/services/userApi'
import { IFeeding, IUser, PainScore, Pet } from '../types'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from '../redux/store'
import { clearUser, setTokenTransactions, setUser } from '../redux/features/userSlice'
import { setChartData, setPet, setPets, setPetStats, setPetsWithNoLogs } from '../redux/features/petSlice'
import FeedingDrawer from '../drawers/guardian/FeedingDrawer'
import PainDrawer from '../drawers/guardian/PainDrawer'
import NeedToUpgradeDrawer from '../drawers/general/NeedToUpgradeDrawer'
import { setPainScores } from '../redux/features/painSlice'
import { setFeedings } from '../redux/features/feedingSlice'
import { setWaters } from '../redux/features/waterSlice'
import { setVitalSigns } from '../redux/features/vitalSignsSlice'
import { setMovements } from '../redux/features/movementSlice'
import { setMedications } from '../redux/features/medicationSlice'
import AppointmentDrawer from '../drawers/guardian/AppointmentDrawer'
import { setAppointments } from '../redux/features/appointmentSlice'
import { setBloodSugars } from '../redux/features/bloodSugarSlice'
import { setSeizures } from '../redux/features/seizureSlice'

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

const GuardianLayout: FC<IChildren> = ({ children }) => {
  const { status } = useSession()
  const dispatch = useAppDispatch()
  const { data } = useFetchMeQuery(undefined) as IFetchMe

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
    } else if (status === 'unauthenticated') {
      dispatch(clearUser())
    }
  }, [data, status, dispatch])

  return (
    <>
      <PetDrawer />
      <PainDrawer />
      <FeedingDrawer />
      <WaterDrawer />
      <VitalSignsDrawer />
      <MovementDrawer />
      <AppointmentDrawer />
      <MedicationDrawer />
      <BloodSugarDrawer />
      <SeizureDrawer />
      <GuardianActionMenu />
      <NotificationDrawer />
      <NeedToUpgradeDrawer />

      {/* <GuardianToolbar /> */}
      <div className="flex">
        <GuardianNavigation />
        <div className={`flex flex-col mx-auto ml-0 md:ml-64 w-[calc(100vw-256px)]`}>{children}</div>
      </div>
    </>
  )
}

export default GuardianLayout
