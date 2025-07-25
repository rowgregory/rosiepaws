'use client'

import React, { FC, ReactNode } from 'react'
import Header from './components/header/Header'
import useSyncUserToRedux from './hooks/useSyncUserToRedux'
import useCustomPathname from './hooks/useCustomPathname'
import Footer from './components/footer/Footer'
import AdminConfirmModal from './modals/AdminConformModal'

const PageWrapper: FC<{ children: ReactNode; user: any }> = ({ children, user }) => {
  const path = useCustomPathname()
  useSyncUserToRedux(user)

  const hide = ['/guardian', '/auth/login', '/admin', '/buy', '/support'].some((item) => path.includes(item))

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
