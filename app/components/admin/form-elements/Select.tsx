import React, { FC } from 'react'

interface SelectProps {
  name: string
  handleInput: any
  value: any
  error: string
  list: any
  label?: string
}

const Select: FC<SelectProps> = ({ name, handleInput, value, error, list, label }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 capitalize">
        {label ?? name}
      </label>
      <select
        name={name}
        id={name}
        onChange={handleInput}
        value={value}
        className={`${
          error ? 'border-red-500' : 'border-[#dddddd]'
        } h-7 border-1  px-3 focus:outline-none rounded-lg focus:border-indigo-500 text-13`}
      >
        {list.map((item: any, i: number) => (
          <option key={i} value={item?.id ?? item}>
            {item?.name ?? item}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
