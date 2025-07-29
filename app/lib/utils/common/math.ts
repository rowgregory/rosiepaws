export const parseFraction = (fractionStr: string): number => {
  if (!fractionStr) return 0

  const str = fractionStr.trim()

  // Handle whole numbers (e.g., "2", "3")
  if (!str.includes('/')) {
    return parseFloat(str) || 0
  }

  // Handle mixed numbers (e.g., "1 1/2", "2 3/4")
  if (str.includes(' ')) {
    const parts = str.split(' ')
    const wholeNumber = parseFloat(parts[0]) || 0
    const fractionPart = parts[1]

    if (fractionPart && fractionPart.includes('/')) {
      const [numerator, denominator] = fractionPart.split('/')
      const fractionValue = (parseFloat(numerator) || 0) / (parseFloat(denominator) || 1)
      return wholeNumber + fractionValue
    }

    return wholeNumber
  }

  // Handle simple fractions (e.g., "1/2", "3/4")
  const [numerator, denominator] = str.split('/')
  return (parseFloat(numerator) || 0) / (parseFloat(denominator) || 1)
}
