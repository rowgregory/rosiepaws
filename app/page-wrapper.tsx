import React, { FC } from 'react'
import { ClientPageProps } from './types/common.types'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'

const PageWrapper: FC<ClientPageProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default PageWrapper
