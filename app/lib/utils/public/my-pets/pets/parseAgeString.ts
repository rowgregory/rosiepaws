const parseAgeString = (ageString: string): { ageYears: string; ageMonths: string } => {
  // Return empty values if no string provided
  if (!ageString || typeof ageString !== 'string') {
    return { ageYears: '', ageMonths: '' }
  }

  // Clean the string - remove extra spaces and make lowercase
  const cleanString = ageString.trim().toLowerCase()

  // Extract years (always present)
  const yearMatch = cleanString.match(/(\d+)\s*(?:years?|yrs?)/)
  const ageYears = yearMatch ? yearMatch[1] : ''

  // Extract months (always present, even if 0)
  const monthMatch = cleanString.match(/(\d+)\s*(?:months?|mos?)/)
  const ageMonths = monthMatch ? monthMatch[1] : '0'

  return { ageYears, ageMonths }
}

export default parseAgeString
