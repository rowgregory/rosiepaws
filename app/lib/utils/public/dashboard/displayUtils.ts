export const getActiveStyles = (color: string, isActive: boolean) => {
  if (!isActive) return 'border-gray-200 bg-white hover:border-gray-300'

  const colorMap: any = {
    red: 'border-red-300 bg-gradient-to-br from-red-50 to-red-100',
    orange: 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100',
    blue: 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'border-green-300 bg-gradient-to-br from-green-50 to-green-100',
    purple: 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100',
    yellow: 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100',
    gray: 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100',
    fuchsia: 'border-fuchsia-300 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100'
  }

  return colorMap[color] || 'border-red-300 bg-gradient-to-br from-red-50 to-red-100'
}

export const getPainScoreColor = (score: number) => {
  switch (score) {
    case 0:
      return 'text-green-600'
    case 1:
      return 'text-yellow-600'
    case 2:
      return 'text-orange-600'
    case 3:
      return 'text-red-600'
    case 4:
      return 'text-red-800'
    default:
      return 'text-gray-600'
  }
}
