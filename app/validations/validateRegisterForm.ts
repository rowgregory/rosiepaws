interface ValidationErrors {
  firstName: string
  lastName: string
  email: string
  securityQuestion: string
  securityAnswer: string
  password: string
}

const validateRegisterForm = (inputs: ValidationErrors, setErrors: any) => {
  const newErrors: any = {}

  if (!inputs?.firstName?.trim()) {
    newErrors.firstName = 'First name is required'
  }
  if (!inputs?.lastName?.trim()) {
    newErrors.lastName = 'Last name is required'
  }

  if (!inputs?.email?.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputs.email)) {
    newErrors.email = 'Invalid email format'
  }
  if (!inputs?.securityQuestion?.trim()) {
    newErrors.securityQuestion = 'Security question is required'
  }
  if (!inputs?.securityAnswer?.trim()) {
    newErrors.securityAnswer = 'Security answer is required'
  }

  if (!inputs?.password?.trim()) {
    newErrors.password = 'Password is required'
  } else if (inputs.password.length < 10) {
    newErrors.password = 'Password must be at least 10 characters long'
  } else if (!/[0-9]/.test(inputs.password)) {
    newErrors.password = 'Password must contain at least one number'
  } else if (!/[a-z]/.test(inputs.password)) {
    newErrors.password = 'Password must contain at least one lowercase letter'
  } else if (!/[A-Z]/.test(inputs.password)) {
    newErrors.password = 'Password must contain at least one uppercase letter'
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(inputs.password)) {
    newErrors.password = 'Password must contain at least one special character: !@#$%^&*(),'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateRegisterForm
