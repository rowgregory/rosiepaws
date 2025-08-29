'use client'

import React, { FC, ReactNode, useMemo } from 'react'
import Header from './components/header/Header'
import useCustomPathname from './hooks/useCustomPathname'
import Footer from './components/footer/Footer'
import AdminConfirmModal from './modals/AdminConfirmModal'
import useAppDataSync from './hooks/useAppDataSync'
import NotEnoughTokensModal from './modals/NotEnoughTokensModal'
import { Accessibility } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from './redux/store'
import { setToggleAccessibilityDrawer } from './redux/features/appSlice'
import AccessibilityDrawer from './drawers/general/AccessibilityDrawer'
import useAccessibilityCheckmark from './hooks/useAccessibilityCheckmark'
import CheckmarkSVG from '@/public/svg/CheckmarkSVG'

const PageWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  useAppDataSync()
  const { showCheckmark, isClient } = useAccessibilityCheckmark()
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { accessibility } = useAppSelector((state: RootState) => state.app)
  const toggleAccessibilityDrawer = () => dispatch(setToggleAccessibilityDrawer(accessibility))
  const hide = ['/guardian', '/auth/login', '/admin', '/buy', '/support'].some((item) => path.includes(item))
  const isGuardianOrAdminLink = ['/guardian', '/admin'].some((item) => path.includes(item))

  const StaticComponents = useMemo(
    () => (
      <>
        <AccessibilityDrawer />
        <AdminConfirmModal />
        <NotEnoughTokensModal />
      </>
    ),
    []
  )

  return (
    <div className="main-content">
      {StaticComponents}
      {!hide && <Header />}
      {children}
      {!hide && <Footer />}
      <div onClick={toggleAccessibilityDrawer} className="relative cursor-pointer">
        <Accessibility
          className={`${isGuardianOrAdminLink ? 'bottom-5 left-5 lg:left-auto lg:top-5 lg:right-5' : 'bottom-5 left-5'} p-2 bg-indigo-600 text-white rounded-full w-8 h-8 fixed z-[110]  cursor-pointer hover:animate-rotateToTwoOClock`}
        />
        {isClient && showCheckmark && <CheckmarkSVG />}
      </div>
    </div>
  )
}

export default PageWrapper
