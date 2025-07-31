import { ReactNode } from 'react'

export interface ChildrenProps {
  children: ReactNode
}

export interface ClientPageProps {
  children: ReactNode
}

export interface ErrorPayload {
  data: {
    message: string
    sliceName: string
  }
}

export type User = {
  isAuthenticated: boolean
  role: string
  isAdmin: boolean
  id: string
  exp: number
}

export interface IPage {
  children: ReactNode
}
