export const PAIN_LEVELS = [
  {
    score: 0,
    label: 'No Pain',
    description: 'Happy and active',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50'
  },
  {
    score: 1,
    label: 'Mild Pain',
    description: 'Slightly uncomfortable',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    score: 2,
    label: 'Moderate Pain',
    description: 'Noticeable discomfort',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  {
    score: 3,
    label: 'Severe Pain',
    description: 'Significant discomfort',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50'
  },
  {
    score: 4,
    label: 'Extreme Pain',
    description: 'Severe distress',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50'
  }
]

function getLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

export const QUICK_TIMES = [
  { label: 'Just now', value: getLocalISOString(new Date()) },
  { label: '1 hour ago', value: getLocalISOString(new Date(Date.now() - 60 * 60 * 1000)) },
  { label: '2 hours ago', value: getLocalISOString(new Date(Date.now() - 2 * 60 * 60 * 1000)) },
  { label: '3 hours ago', value: getLocalISOString(new Date(Date.now() - 3 * 60 * 60 * 1000)) }
]
