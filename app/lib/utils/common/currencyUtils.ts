export type CurrencyInput = number | null | undefined

export interface CurrencyFormatOptions {
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  fallback?: string
}

export const formatCurrency = (amount: CurrencyInput, options: CurrencyFormatOptions = {}): string => {
  const { currency = 'USD', minimumFractionDigits = 2, maximumFractionDigits = 2, fallback = '$0.00' } = options

  if (amount == null) return fallback

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount)
}

// Convenience functions
export const formatPrice = (amount: CurrencyInput) => formatCurrency(amount)
export const formatBudget = (amount: CurrencyInput) => formatCurrency(amount, { fallback: 'Not set' })
export const formatCurrencyCompact = (amount: CurrencyInput) => formatCurrency(amount, { maximumFractionDigits: 0 })

// formatCurrency(1234.56)                                    // "$1,234.56"
// formatCurrency(1234.56, { currency: 'EUR' })               // "€1,234.56"
// formatCurrency(1234.567, { maximumFractionDigits: 3 })     // "$1,234.567"
// formatCurrency(1234, { minimumFractionDigits: 0 })         // "$1,234"
// formatCurrency(null, { fallback: 'Price TBD' })            // "Price TBD"
// formatCurrency(1234.56, { currency: 'GBP' })               // "£1,234.56"

// Convenience functions:
// formatPrice(99.99)              // "$99.99"
// formatBudget(null)              // "Not set"
// formatBudget(5000)              // "$5,000.00"
// formatCurrencyCompact(1234.78)  // "$1,235" (rounded, no decimals)
// formatCurrencyCompact(1000000)  // "$1,000,000"
