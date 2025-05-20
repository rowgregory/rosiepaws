interface ValidationErrors {
  password: string
}

const validateResetPasswordForm = (inputs: ValidationErrors, setErrors: any) => {
  const newErrors: any = {}

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

export default validateResetPasswordForm
