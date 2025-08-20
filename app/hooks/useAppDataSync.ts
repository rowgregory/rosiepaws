import { setPainScores } from '../redux/features/painSlice'
import { setFeedings } from '../redux/features/feedingSlice'
import { setWaters } from '../redux/features/waterSlice'
import { setVitalSigns } from '../redux/features/vitalSignsSlice'
import { setMovements } from '../redux/features/movementSlice'
import { setMedications } from '../redux/features/medicationSlice'
import { setAppointments } from '../redux/features/appointmentSlice'
import { setBloodSugars } from '../redux/features/bloodSugarSlice'
import { setSeizures } from '../redux/features/seizureSlice'
import { setGalleryItems } from '../redux/features/galleryItemSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { clearUser, setTokenTransactions, setUser } from '../redux/features/userSlice'
import {
  setChartData,
  setPet,
  setPets,
  setPetStats,
  setPetsWithNoLogs,
  setSelectedPetWithChartData
} from '../redux/features/petSlice'
import { useEffect, useRef } from 'react'
import { useFetchMeQuery } from '../redux/services/userApi'

interface IFetchMe {
  data: {
    user: any
    pets: any[]
    stats: any
    petsWithNoLogs: any[]
    chartData: any
    painScores: any[]
    feedings: any[]
    waters: any[]
    vitalSigns: any[]
    movements: any[]
    medications: any[]
    appointments: any[]
    bloodSugars: any[]
    seizures: any[]
    tokenTransactions: any[]
  }
  isLoading: boolean
  error: any
}

function useAppDataSync() {
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  // Use a ref to track previous data for deep compare
  const prevDataRef = useRef<any>(null)

  const { data, error } = useFetchMeQuery(undefined, {
    skip: Object.keys(user).length === 0
  }) as IFetchMe

  useEffect(() => {
    const prevData = prevDataRef.current

    // Compare JSON strings to detect changes (simple deep compare)
    const isDifferent = !prevData || JSON.stringify(prevData) !== JSON.stringify(data)

    if (data?.user && isDifferent) {
      // User data (includes latest subscription info from webhooks)
      dispatch(setUser(data.user))
      dispatch(setGalleryItems(data?.user?.galleryItems))

      // Pet data
      if (data.pets) {
        dispatch(setPets(data.pets))
        if (data.pets[0]) {
          dispatch(setPet(data.pets[0]))
        }
      }

      // Stats and analytics
      if (data.stats) dispatch(setPetStats(data.stats))
      if (data.petsWithNoLogs) dispatch(setPetsWithNoLogs(data.petsWithNoLogs))
      if (data.chartData) dispatch(setChartData(data.chartData))

      // Health tracking data
      if (data.painScores) dispatch(setPainScores(data.painScores))
      if (data.feedings) dispatch(setFeedings(data.feedings))
      if (data.waters) dispatch(setWaters(data.waters))
      if (data.vitalSigns) dispatch(setVitalSigns(data.vitalSigns))
      if (data.movements) dispatch(setMovements(data.movements))
      if (data.medications) dispatch(setMedications(data.medications))
      if (data.appointments) dispatch(setAppointments(data.appointments))
      if (data.bloodSugars) dispatch(setBloodSugars(data.bloodSugars))
      if (data.seizures) dispatch(setSeizures(data.seizures))

      // Combined pet data for charts
      if (data.stats && data.chartData && data.pets?.[0]) {
        dispatch(
          setSelectedPetWithChartData({
            stats: data.stats,
            chartData: data.chartData,
            pet: data.pets[0]
          })
        )
      }

      // Token transactions
      if (data.tokenTransactions) dispatch(setTokenTransactions(data.tokenTransactions))

      // Update the ref with current data
      prevDataRef.current = data
    } else if (error) {
      // Handle error case - clear user data
      dispatch(clearUser())
    }
  }, [data, error, dispatch])
}

export default useAppDataSync
