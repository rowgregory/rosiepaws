'use client'

import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { IPage } from './types/common.types'
import PageWrapper from './page-wrapper'
import { store } from './redux/store'
import { SessionProvider } from 'next-auth/react'

const ReduxWrapper: FC<IPage> = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PageWrapper session={session}>{children}</PageWrapper>
      </Provider>
    </SessionProvider>
  )
}

export default ReduxWrapper
