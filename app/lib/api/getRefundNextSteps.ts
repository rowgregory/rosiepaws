const getRefundNextSteps = (refundStatus: string | null, emailSent: boolean): string[] => {
  const baseSteps = []

  switch (refundStatus) {
    case 'succeeded':
      baseSteps.push('Refund has been processed successfully')
      baseSteps.push("Funds will appear in customer's account within 5-10 business days")
      break
    case 'pending':
      baseSteps.push('Refund is being processed')
      baseSteps.push('This may take a few minutes to complete')
      break
    case 'failed':
      baseSteps.push('Refund failed - please check Stripe dashboard for details')
      baseSteps.push('You may need to process this manually')
      break
    case null:
    case undefined:
      baseSteps.push('Refund initiated - status pending')
      baseSteps.push('Check Stripe dashboard for current status')
      break
    default:
      baseSteps.push('Refund status unclear - check Stripe dashboard')
  }

  if (emailSent) {
    baseSteps.push('Customer has been notified via email')
  } else {
    baseSteps.push('Consider manually notifying the customer')
  }

  baseSteps.push('Monitor subscription status for any required adjustments')

  return baseSteps
}

export default getRefundNextSteps
