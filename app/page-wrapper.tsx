import React, { FC } from 'react'
import { ClientPageProps } from './types/common.types'

const PageWrapper: FC<ClientPageProps> = ({ children }) => {
  return <div>{children}</div>
}

export default PageWrapper
