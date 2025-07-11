'use client'

import React, { FC } from 'react'
import { IPage } from './types/common.types'
import Header from './components/header/Header'
// import Footer from './components/footer/Footer'
// import useSyncUserToRedux from './hooks/useSyncUserToRedux'
import useCustomPathname from './hooks/useCustomPathname'
import { useSession } from 'next-auth/react'

const PageWrapper: FC<IPage> = ({ children }) => {
  // useSyncUserToRedux(user)
  const path = useCustomPathname()
  const { data: session } = useSession()
  console.log('SESSION: ', session)
  // console.log('PATH: ', path)

  const hide = ['/guardian', '/auth/login'].some((item) => path.includes(item))

  return (
    <>
      {!hide && <Header />}
      {children}
      {/* <Footer /> */}
    </>
  )
}

export default PageWrapper
