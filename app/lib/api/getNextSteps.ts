const getNextSteps = (result: any): string[] => {
  switch (result.status) {
    case 'paid':
    case 'succeeded':
      return [
        'Payment successful - subscription is now active',
        'Customer will receive a receipt via email',
        'Next billing cycle will proceed normally'
      ]

    case 'payment_failed':
    case 'failed':
      if (result.declineCode) {
        return [
          `Payment failed: ${getDeclineCodeMessage(result.declineCode)}`,
          'Consider contacting the customer to update their payment method',
          'You may want to send a payment update link'
        ]
      }
      return [
        'Payment failed - customer may need to update payment method',
        'Check if the card has sufficient funds or is expired',
        'Consider sending a payment method update email'
      ]

    case 'requires_action':
      return [
        'Payment requires additional authentication (3D Secure)',
        'Customer needs to complete authentication',
        'Consider contacting customer or sending update link'
      ]

    default:
      return [
        'Payment status unclear - check Stripe dashboard for details',
        'May require manual intervention',
        'Consider contacting the customer directly'
      ]
  }
}

function getDeclineCodeMessage(declineCode: string): string {
  const declineMessages: Record<string, string> = {
    insufficient_funds: 'Insufficient funds in account',
    card_declined: 'Card was declined by the bank',
    expired_card: 'Card has expired',
    incorrect_cvc: 'Incorrect security code',
    processing_error: 'Processing error occurred',
    card_not_supported: 'Card type not supported',
    currency_not_supported: 'Currency not supported',
    duplicate_transaction: 'Duplicate transaction detected',
    fraudulent: 'Transaction flagged as fraudulent',
    generic_decline: 'Card was declined',
    incorrect_number: 'Incorrect card number',
    incorrect_zip: 'Incorrect postal code',
    invalid_account: 'Invalid account',
    invalid_amount: 'Invalid amount',
    invalid_cvc: 'Invalid security code',
    invalid_expiry_month: 'Invalid expiry month',
    invalid_expiry_year: 'Invalid expiry year',
    invalid_number: 'Invalid card number',
    issuer_not_available: 'Card issuer unavailable',
    lost_card: 'Card reported as lost',
    merchant_blacklist: 'Payment blocked by merchant',
    new_account_information_available: 'New account information available',
    no_action_taken: 'No action taken by issuer',
    not_permitted: 'Transaction not permitted',
    pickup_card: 'Card should be picked up',
    pin_try_exceeded: 'PIN tries exceeded',
    restricted_card: 'Card is restricted',
    revocation_of_all_authorizations: 'All authorizations revoked',
    revocation_of_authorization: 'Authorization revoked',
    security_violation: 'Security violation',
    service_not_allowed: 'Service not allowed',
    stolen_card: 'Card reported as stolen',
    stop_payment_order: 'Stop payment order',
    testmode_decline: 'Test mode decline',
    transaction_not_allowed: 'Transaction not allowed',
    try_again_later: 'Try again later',
    withdrawal_count_limit_exceeded: 'Withdrawal limit exceeded'
  }

  return declineMessages[declineCode] || `Card declined (${declineCode})`
}

export default getNextSteps
