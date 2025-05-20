import React, { FC } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { createFormActions } from '../redux/features/formSlice'
import Spinner from '../components/common/Spinner'
import Link from 'next/link'
import AuthInput from '../components/auth/form-elements/AuthInput'
import { AuthFormProps } from '../types/auth.types'

const LoginForm: FC<AuthFormProps> = ({ handleSubmit, isLoading, error }) => {
  const dispatch = useAppDispatch()
  const { loginForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput } = createFormActions('loginForm', dispatch)

  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 space-y-8"
      >
        <div className="text-center space-y-1">
          <h1 className="font-barlowcondensed font-semibold text-3xl text-roseblush">Hi there,</h1>
          <h2 className="font-barlowcondensed font-bold text-2xl text-olivepetal">Welcome Back</h2>
        </div>
        <div className="space-y-6">
          <AuthInput
            name="email"
            value={loginForm?.inputs?.email}
            onChange={handleInput}
            label="Email"
            error={loginForm?.errors?.email}
          />
          <AuthInput
            name="password"
            value={loginForm?.inputs?.password}
            onChange={handleInput}
            label="Password"
            error={loginForm?.errors?.password}
          />
        </div>
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="font-barlowcondensed uppercase text-12 font-medium text-peachblossum hover:underline"
          >
            Forgot Password
          </Link>
        </div>
        {error && <div className="text-center text-sm font-merriweather text-red-500 -mt-2">{error}</div>}
        <button
          className="w-full bg-olivepetal hover:bg-goldenclover transition-colors duration-200 text-white font-barlowcondensed uppercase text-sm py-3 rounded-md"
          type="submit"
        >
          {isLoading ? <Spinner fill="fill-white" track="text-olivepetal" /> : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
