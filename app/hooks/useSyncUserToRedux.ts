import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../redux/store'
import { setAuthState } from '../redux/features/authSlice'
import { User } from '../types/common'
import { setUser } from '../redux/features/userSlice'

function useSyncUserToRedux(userData: User | null) {
  const dispatch = useAppDispatch()

  // Use a ref to track previous user data for deep compare
  const prevUserRef = useRef<User | null>(null)

  useEffect(() => {
    const prevUser = prevUserRef.current

    // Compare JSON strings to detect changes (simple deep compare)
    const isDifferent = !prevUser || JSON.stringify(prevUser) !== JSON.stringify(userData)

    if (userData && isDifferent) {
      dispatch(setAuthState(userData))
      dispatch(setUser(userData))
      prevUserRef.current = userData
    }
  }, [userData, dispatch])
}

export default useSyncUserToRedux
