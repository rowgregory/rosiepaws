export interface RegisterFormState {
  firstName: string
  lastName: string
  email: string
  password: string
  securityQuestion: string
  securityAnswer: string
}

export const registerInitialState: RegisterFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  securityQuestion: '',
  securityAnswer: ''
}
