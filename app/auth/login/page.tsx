'use client'

import React, { FormEvent } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { useLoginMutation } from '@/app/redux/services/authApi'
import LoginForm from '@/app/forms/LoginForm'
import { useRouter } from 'next/navigation'
import validateLoginForm from '@/app/validations/validateLoginForm'
import { createFormActions } from '@/app/redux/features/formSlice'
import { getErrorMessage } from '@/app/lib/utils/logHelper'

const Login = () => {
  const { push } = useRouter()
  const { loginForm } = useAppSelector((state: RootState) => state.form)
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const { setErrors } = createFormActions('loginForm', dispatch)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    const isValid = validateLoginForm(loginForm?.inputs, setErrors)
    if (!isValid) return

    try {
      const response = await login({
        email: loginForm.inputs.email.trim().toLowerCase(),
        password: loginForm.inputs.password
      }).unwrap()

      if (response.payload.role === 'admin' && response.payload.isAdmin) {
        push('/admin/dashboard')
      } else if (response.payload.role === 'basic_user' || response.payload.role === 'premium_user') {
        push('/guardian/dashboard')
      }
    } catch {}
  }

  return (
    <div className="min-h-dvh w-full bg-articdaisy bg-dust bg-repeat flex items-center justify-center px-4 py-12">
      <LoginForm handleSubmit={handleLogin} isLoading={isLoading} error={getErrorMessage(error)} />
    </div>
  )
}

export default Login
