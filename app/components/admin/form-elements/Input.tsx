import { FC } from 'react'

const Input: FC<{ name: string; handleInput: any; value: any; type?: string; step?: string; error?: string }> = ({
  name,
  handleInput,
  value,
  type,
  step,
  error
}) => {
  return (
    <span>
      <label htmlFor={name} className="capitalize text-sm font-medium text-[#353a44]">
        {name}
      </label>
      <input
        type={type ?? 'text'}
        id={name}
        name={name}
        onChange={handleInput}
        value={value}
        className={`pl-3 h-7 rounded-lg focus:outline-none border-1 text-sm focus:border-indigo-500 ${
          error ? 'border-red-500' : 'border-[#dddddd]'
        } w-full`}
        step={step}
      />
    </span>
  )
}

export default Input
