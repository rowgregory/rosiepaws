'use client'

import { FC, ReactNode, useEffect, useMemo } from 'react'
import Header from './components/header/Header'
import useCustomPathname from './hooks/useCustomPathname'
import Footer from './components/footer/Footer'
import AdminConfirmModal from './modals/AdminConfirmModal'
import useAppDataSync from './hooks/useAppDataSync'
import NotEnoughTokensModal from './modals/NotEnoughTokensModal'
import { Accessibility } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector, useUserSelector } from './redux/store'
import { setOpenChangePlanModal, setToggleAccessibilityDrawer } from './redux/features/appSlice'
import AccessibilityDrawer from './drawers/general/AccessibilityDrawer'
import useAccessibilityCheckmark from './hooks/useAccessibilityCheckmark'
import CheckmarkSVG from '@/public/svg/CheckmarkSVG'
import ChangePlanModal from './modals/ChangePlanModal'
import Pusher from 'pusher-js'
import { api } from './redux/services/api'
import { setIsNotWaitingForWebhook } from './redux/features/userSlice'
import { useRouter } from 'next/navigation'
import Toast from './components/common/Toast'

let pusherInstance: Pusher | null = null

const getPusher = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })
  }
  return pusherInstance
}

const AccessibilityIcon = () => {
  const { showCheckmark, isClient } = useAccessibilityCheckmark()
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { accessibility } = useAppSelector((state: RootState) => state.app)
  const isGuardianOrAdminLink = ['/guardian', '/admin'].some((item) => path.includes(item))

  const toggleAccessibilityDrawer = () => dispatch(setToggleAccessibilityDrawer(accessibility))
  return (
    <div onClick={toggleAccessibilityDrawer} className="relative cursor-pointer">
      <Accessibility
        className={`${isGuardianOrAdminLink ? 'bottom-5 left-5 lg:left-auto lg:top-5 lg:right-5' : 'bottom-5 left-5'} p-2 bg-indigo-600 text-white rounded-full w-8 h-8 fixed z-[110]  cursor-pointer hover:animate-rotateToTwoOClock`}
      />
      {isClient && showCheckmark && <CheckmarkSVG />}
    </div>
  )
}

const PageWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  useAppDataSync()
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const hide = ['/guardian', '/auth/login', '/admin', '/buy', '/support', '/auth/custom-callback'].some((item) =>
    path.includes(item)
  )
  const { user } = useUserSelector()

  const StaticComponents = useMemo(
    () => (
      <>
        <AccessibilityDrawer />
        <AdminConfirmModal />
        <NotEnoughTokensModal />
        <ChangePlanModal />
        <Toast />
      </>
    ),
    []
  )

  useEffect(() => {
    const pusher = getPusher()
    const channelName = `user`

    // Subscribe to user channel
    const channel = pusher.subscribe(channelName)

    // Listen for plan purchase success
    channel.bind('plan-purchased', (data: { success: any }) => {
      if (data.success) {
        dispatch(setOpenChangePlanModal())
        dispatch(api.util.invalidateTags(['User']))
        dispatch(setIsNotWaitingForWebhook())
        push('/guardian/home')
      }
    })

    // Cleanup on unmount - DON'T disconnect pusher, just unsubscribe
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      // Don't call pusher.disconnect() - let the singleton persist
    }
  }, [dispatch, push, user?.id])

  return (
    <div className="main-content">
      {StaticComponents}
      {!hide && <Header />}
      {children}
      {!hide && <Footer />}
      <AccessibilityIcon />
    </div>
  )
}

export default PageWrapper
