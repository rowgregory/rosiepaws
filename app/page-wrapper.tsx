'use client'

import React, { FC, ReactNode } from 'react'
import Header from './components/header/Header'
import useCustomPathname from './hooks/useCustomPathname'
import Footer from './components/footer/Footer'
import AdminConfirmModal from './modals/AdminConfirmModal'
import useAppDataSync from './hooks/useAppDataSync'
import NotEnoughTokensModal from './modals/NotEnoughTokensModal'

const PageWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const path = useCustomPathname()
  useAppDataSync()

  const hide = ['/guardian', '/auth/login', '/admin', '/buy', '/support'].some((item) => path.includes(item))

  return (
    <>
      <AdminConfirmModal />
      <NotEnoughTokensModal />
      {!hide && <Header />}
      {children}
      {!hide && <Footer />}
    </>
  )
}

export default PageWrapper
