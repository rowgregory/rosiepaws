'use client'

import { FC } from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'

const ReduxWrapper: FC<{ children: any }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default ReduxWrapper
