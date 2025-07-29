export const SelectInput = ({
  value,
  onChange,
  label,
  options,
  description,
  name
}: {
  value: string
  onChange: any
  label: string
  options: { value: string; label: string }[]
  description?: string
  name: string
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
)
