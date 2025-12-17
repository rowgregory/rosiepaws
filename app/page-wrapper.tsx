'use client'

import { FC, ReactNode, useEffect, useMemo } from 'react'
import Header from './components/header/Header'
import useCustomPathname from './hooks/useCustomPathname'
import Footer from './components/footer/Footer'
import AdminConfirmModal from './modals/AdminConfirmModal'
import useAppDataSync from './hooks/useAppDataSync'
import NotEnoughTokensModal from './modals/NotEnoughTokensModal'
import { useAppDispatch } from './redux/store'
import { setOpenChangePlanModal } from './redux/features/appSlice'
import AccessibilityDrawer from './drawers/general/AccessibilityDrawer'
import ChangePlanModal from './modals/ChangePlanModal'
import { api } from './redux/services/api'
import { setIsNotWaitingForWebhook } from './redux/features/userSlice'
import { useRouter } from 'next/navigation'
import Toast from './components/common/Toast'
import AccessibilityIcon from './components/AccessibilityIcon'
import getPusher from './lib/pusher/getPusher'
import { useSession } from 'next-auth/react'
import { showToast } from './redux/features/toastSlice'

const PageWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  useAppDataSync()
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { push } = useRouter()
  const { data: session, update } = useSession()

  const hideHeaderFooter = useMemo(
    () =>
      ['/guardian', '/auth/login', '/admin', '/buy', '/support', '/auth/custom-callback'].some((route) =>
        path.includes(route)
      ),
    [path]
  )

  useEffect(() => {
    if (!session?.user?.id) return

    const pusher = getPusher()
    const channel = pusher.subscribe(`user-${session.user.id}`)

    channel.bind('plan-purchased', (data: { success: boolean }) => {
      if (data.success) {
        dispatch(setOpenChangePlanModal())
        dispatch(api.util.invalidateTags(['User']))
        dispatch(setIsNotWaitingForWebhook())
        push('/guardian/home')
      }
    })

    channel.bind('tier-updated', async (data: { tier: string }) => {
      await update()
      dispatch(api.util.invalidateTags(['User']))
      dispatch(showToast({ message: `Your account tier has been updated to ${data.tier}`, type: 'success' }))
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [dispatch, push, session?.user?.id, update])

  return (
    <div className="main-content">
      <AccessibilityDrawer />
      <AdminConfirmModal />
      <NotEnoughTokensModal />
      <ChangePlanModal />
      <Toast />

      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}

      <AccessibilityIcon />
    </div>
  )
}

export default PageWrapper
