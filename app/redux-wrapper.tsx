'use client'

import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { IPage } from './types/common.types'
import PageWrapper from './page-wrapper'
import { store } from './redux/store'

const ReduxWrapper: FC<IPage> = ({ children, user }) => {
  return (
    <Provider store={store}>
      <PageWrapper user={user}>{children}</PageWrapper>
    </Provider>
  )
}

export default ReduxWrapper
