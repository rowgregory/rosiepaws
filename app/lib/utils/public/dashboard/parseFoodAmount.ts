export const parseFoodAmount = (foodAmount: any) => {
  // If it's already a number, return it
  if (typeof foodAmount === 'number') {
    return foodAmount
  }

  // Convert to string and trim whitespace
  const str = String(foodAmount).trim()

  // Check if it's a fraction (contains '/')
  if (str.includes('/')) {
    const [numerator, denominator] = str.split('/')
    const num = parseFloat(numerator)
    const den = parseFloat(denominator)

    // Make sure both parts are valid numbers and denominator isn't zero
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den
    }
  }

  // Try to parse as regular number
  const parsed = parseFloat(str)
  return isNaN(parsed) ? 0 : parsed
}
