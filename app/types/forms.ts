import { Pet } from './entities'

export interface IForm {
  inputs: any
  errors: any
  handleInput: any
  close: () => void
  handleSubmit: any
  loading: boolean
  pets?: Pet[]
  handleToggle?: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadingVideo?: boolean
  isUpdating?: boolean
}
