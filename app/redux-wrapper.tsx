'use client'

import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { IPage } from './types/common.types'
import PageWrapper from './page-wrapper'
import { store } from './redux/store'
import { SessionProvider } from 'next-auth/react'

const ReduxWrapper: FC<IPage> = ({ children }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PageWrapper>{children}</PageWrapper>
      </Provider>
    </SessionProvider>
  )
}

export default ReduxWrapper
