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
