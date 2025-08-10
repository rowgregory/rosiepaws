export interface IForm {
  inputs: any
  errors: any
  handleInput: any
  close: () => void
  handleSubmit: any
  loading: boolean
  handleToggle?: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadingVideo?: boolean
  isUpdating?: boolean
}
