import React, { FC } from 'react'
import { ClientPageProps } from './types/common.types'
import Header from './components/header/Header'

const PageWrapper: FC<ClientPageProps> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default PageWrapper
