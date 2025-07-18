'use client'

import React, { FC } from 'react'
import { Provider } from 'react-redux'
import PageWrapper from './page-wrapper'
import { store } from './redux/store'

const ReduxWrapper: FC<{ children: any; session: any }> = ({ children, session }) => {
  return (
    <Provider store={store}>
      <PageWrapper user={session?.user || {}}>{children}</PageWrapper>
    </Provider>
  )
}

export default ReduxWrapper
