'use client'

import React, { FC } from 'react'
import { IPage } from './types/common.types'
import Header from './components/header/Header'
// import Footer from './components/footer/Footer'
// import useSyncUserToRedux from './hooks/useSyncUserToRedux'
import useCustomPathname from './hooks/useCustomPathname'

const PageWrapper: FC<IPage> = ({ children, session }) => {
  // useSyncUserToRedux(user)
  const path = useCustomPathname()
  console.log('SESSION: ', session)

  return (
    <>
      {!path.includes('/guardian') && <Header />}
      {children}
      {/* <Footer /> */}
    </>
  )
}

export default PageWrapper
