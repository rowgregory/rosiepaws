interface ValidationErrors {
  email: string
  securityQuestion: string
  securityAnswer: string
}

const validateForgotPasswordForm = (inputs: ValidationErrors, setErrors: any) => {
  const newErrors: any = {}

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

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateForgotPasswordForm
