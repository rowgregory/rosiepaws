import { ReactNode } from 'react'

export interface ChildrenProps {
  children: ReactNode
}

export interface ClientPageProps {
  children: ReactNode
}

export interface ErrorType {
  data: {
    message: string
  }
}

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  height?: string
  bgColor?: string
}

export type User = {
  isAuthenticated: boolean
  role: string
  isAdmin: boolean
  id: string
  exp: number
}

export interface IPage {
  user: User | null
  children: ReactNode
}
export interface IForm {
  inputs: any
  errors: any
  handleInput: any
  close: any
  handleSubmit: any
  loading: boolean
}
