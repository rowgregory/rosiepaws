import React, { FC } from 'react'

const Textarea: FC<{ name: string; handleInput: any; value: any; error?: string }> = ({
  name,
  handleInput,
  value,
  error
}) => {
  return (
    <span>
      <label htmlFor={name} className="capitalize text-sm font-medium text-[#353a44]">
        {name}
      </label>
      <textarea
        id={name}
        name={name}
        onChange={handleInput}
        value={value}
        className={`p-3 rounded-lg focus:outline-none border-1 ${
          error ? 'border-red-500' : 'border-[#dddddd]'
        } w-full text-sm focus:border-indigo-500`}
        rows={6}
      />
    </span>
  )
}

export default Textarea
