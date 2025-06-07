'use client'

import React, { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import RegisterForm from '@/app/forms/RegisterForm'
import { useRegisterMutation } from '@/app/redux/services/authApi'
import validateRegisterForm from '@/app/validations/validateRegisterForm'
import { createFormActions } from '@/app/redux/features/formSlice'
import { getErrorMessage } from '@/app/lib/utils/logHelper'
import { resetAuth } from '@/app/redux/features/authSlice'
import { increaseUsersCount } from '@/app/redux/features/appSlice'

const Register = () => {
  const { push } = useRouter()
  const { registerForm } = useAppSelector((state: RootState) => state.form)
  const [register, { isLoading, error }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const { setErrors } = createFormActions('registerForm', dispatch)

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()

    const isValid = validateRegisterForm(registerForm.inputs, setErrors)
    if (!isValid) return

    try {
      const response = await register({
        firstName: registerForm.inputs.firstName,
        lastName: registerForm.inputs.lastName,
        email: registerForm.inputs.email.trim().toLowerCase(),
        password: registerForm.inputs.password,
        securityQuestion: registerForm.inputs.securityQuestion,
        securityAnswer: registerForm.inputs.securityAnswer
      }).unwrap()

      if (response.payload.role === 'admin' && response.payload.isAdmin) {
        push('/admin/dashboard')
      } else if (response.payload.role === 'basic_user' || response.payload.role === 'premium_user') {
        push('/guardian/dashboard')
      }

      dispatch(resetAuth())
      dispatch(increaseUsersCount())
    } catch {}
  }

  return (
    <div className="min-h-dvh w-full bg-articdaisy bg-dust bg-repeat flex items-center justify-center px-4 py-12">
      <RegisterForm handleSubmit={handleRegister} isLoading={isLoading} error={getErrorMessage(error)} />
    </div>
  )
}

export default Register
