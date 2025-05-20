import { FC } from 'react'

interface AuthSelectProps {
  name: string
  value: string
  onChange: any
  label: string
  error?: string
  list: string[]
}

const AuthSelect: FC<AuthSelectProps> = ({ name, value, onChange, label, error, list }) => {
  return (
    <div className="flex flex-col gap-y-1 w-full relative">
      <label htmlFor={name} className="font-barlowcondensed text-[0.9rem] text-olivepetal uppercase tracking-wide">
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full h-12 px-4 rounded-md border-[1px] font-merriweather bg-articdaisy bg-dust text-peachblossum placeholder:text-goldenclover transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${
          error
            ? 'border-roseblush ring-roseblush'
            : 'border-goldenclover focus:border-peachblossum focus:ring-peachblossum'
        }`}
      >
        <option value="" disabled>
          Select an option
        </option>
        {list.map((item, i) => (
          <option key={i} value={item}>
            {item}
          </option>
        ))}
      </select>

      {error && <div className="text-roseblush font-merriweather text-sm absolute left-0 -bottom-5">{error}</div>}
    </div>
  )
}

export default AuthSelect
