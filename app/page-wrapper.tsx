'use client'

import React, { FC } from 'react'
import { IPage } from './types/common.types'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import useSyncUserToRedux from './hooks/useSyncUserToRedux'

const PageWrapper: FC<IPage> = ({ children, user }) => {
  useSyncUserToRedux(user)
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default PageWrapper
