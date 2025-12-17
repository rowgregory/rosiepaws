'use client'

import { FC } from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import PageWrapper from './page-wrapper'

const ReduxWrapper: FC<{ children: any }> = ({ children }) => {
  return (
    <Provider store={store}>
      <PageWrapper>{children}</PageWrapper>
    </Provider>
  )
}

export default ReduxWrapper
