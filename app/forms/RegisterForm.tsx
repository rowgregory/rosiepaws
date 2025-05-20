import React, { FC } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { clearErrors, createFormActions } from '../redux/features/formSlice'
import { securityQuestions } from '@/public/data/auth.data'
import Spinner from '../components/common/Spinner'
import Link from 'next/link'
import { AuthFormProps } from '../types/auth.types'
import AuthInput from '../components/auth/form-elements/AuthInput'
import AuthSelect from '../components/auth/form-elements/AuthSelect'

const RegisterForm: FC<AuthFormProps> = ({ handleSubmit, isLoading, error }) => {
  const dispatch = useAppDispatch()
  const { registerForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput, handleSelect } = createFormActions('registerForm', dispatch)

  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 space-y-8"
      >
        <div className="text-center space-y-1">
          <h1 className="font-barlowcondensed font-semibold text-3xl text-roseblush">Hi there,</h1>
          <h2 className="font-barlowcondensed font-bold text-2xl text-olivepetal">Register</h2>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col 760:flex-row gap-y-8 760:gap-8">
            <AuthInput
              name="firstName"
              value={registerForm?.inputs?.firstName}
              onChange={handleInput}
              label="First Name"
              error={registerForm?.errors?.firstName}
            />
            <AuthInput
              name="lastName"
              value={registerForm?.inputs?.lastName}
              onChange={handleInput}
              label="Last Name"
              error={registerForm?.errors?.lastName}
            />
          </div>
          <div className="flex flex-col 760:flex-row gap-y-8 760:gap-8">
            <AuthInput
              name="email"
              value={registerForm?.inputs?.email}
              onChange={handleInput}
              label="Email"
              error={registerForm?.errors?.email}
            />
          </div>
          <AuthSelect
            name="securityQuestion"
            value={registerForm?.inputs?.securityQuestion}
            onChange={handleSelect}
            label="Security Question"
            error={registerForm?.errors?.securityQuestion}
            list={securityQuestions}
          />
          <AuthInput
            name="securityAnswer"
            value={registerForm?.inputs?.securityAnswer}
            onChange={handleInput}
            label="Security Answer"
            error={registerForm?.errors?.securityAnswer}
          />
          <AuthInput
            name="password"
            value={registerForm?.inputs?.password}
            onChange={handleInput}
            label="Password"
            error={registerForm?.errors?.password}
          />
        </div>
        {error && (
          <div className="text-12 font-semibold text-blaze absolute bottom-28 left-1/2 -translate-x-1/2">{error}</div>
        )}
        <button
          className="w-full bg-olivepetal hover:bg-goldenclover transition-colors duration-200 text-white font-barlowcondensed uppercase text-sm py-3 rounded-md focus:outline-none"
          type="submit"
        >
          {isLoading ? <Spinner fill="fill-olivepetal" track="text-white" /> : 'Register'}
        </button>
        <div className="w-full flex items-center justify-center mt-7">
          <Link
            onClick={() => dispatch(clearErrors({ formName: 'loginForm' }))}
            href="/auth/login"
            className="text-13 uppercase font-semibold focus:outline-none border-b-2 hover:text-white"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
