import { ChangeEvent } from 'react'

export interface IForm {
  inputs: any
  errors: any
  handleInput: any
  close: () => void
  handleSubmit: any
  loading: boolean
  handleToggle?: (e: ChangeEvent<HTMLInputElement>) => void
  uploadingVideo?: boolean
  isUpdating?: boolean
}
