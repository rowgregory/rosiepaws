import React, { FC } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { createFormActions } from '../redux/features/formSlice'
import Spinner from '../components/common/Spinner'
import Link from 'next/link'
import { securityQuestions } from '@/public/data/auth.data'
import { AuthFormProps } from '../types/auth.types'
import AuthInput from '../components/auth/form-elements/AuthInput'
import AuthSelect from '../components/auth/form-elements/AuthSelect'

const ForgotPasswordForm: FC<AuthFormProps> = ({ handleSubmit, isLoading, error }) => {
  const dispatch = useAppDispatch()
  const { forgotPasswordForm } = useAppSelector((state: RootState) => state.form)
  const { handleInput, handleSelect } = createFormActions('forgotPasswordForm', dispatch)

  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 space-y-8"
      >
        <div className="text-center space-y-1">
          <h1 className="font-barlowcondensed font-semibold text-3xl text-roseblush">Hi there,</h1>
          <h2 className="font-barlowcondensed font-bold text-2xl text-olivepetal">Sorry you&apos;re having trouble</h2>
        </div>
        <div className="space-y-6">
          <AuthInput
            name="email"
            value={forgotPasswordForm?.inputs?.email}
            onChange={handleInput}
            label="Email"
            error={forgotPasswordForm?.errors?.email}
          />
          <AuthSelect
            label="Security Question"
            value={forgotPasswordForm?.inputs?.securityQuestion}
            onChange={handleSelect}
            name="securityQuestion"
            error={forgotPasswordForm?.errors?.securityQuestion}
            list={securityQuestions}
          />
          <AuthInput
            name="securityAnswer"
            value={forgotPasswordForm?.inputs?.securityAnswer}
            onChange={handleInput}
            label="Security Answer"
            error={forgotPasswordForm?.errors?.securityAnswer}
          />
        </div>
        {error && <div className="text-center text-sm font-merriweather text-red-500 -mt-2">{error}</div>}
        <button
          className="w-full bg-olivepetal hover:bg-goldenclover transition-colors duration-200 text-white font-barlowcondensed uppercase text-sm py-3 rounded-md"
          type="submit"
        >
          {isLoading ? <Spinner fill="fill-white" track="text-blaze" /> : 'Verify'}
        </button>
        <div className="w-full flex items-center justify-center mt-7">
          <Link href="/auth/login" className="font-barlowcondensed text-13 uppercase font-semibold text-blaze">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordForm
