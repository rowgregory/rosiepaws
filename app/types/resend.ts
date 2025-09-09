export interface PaymentFailedEmailData {
  customerEmail: string
  customerName: string
  planName: string
  planPrice: number
  attemptCount: number
  amountDue: number
  invoiceUrl: string
  nextAttemptDate: string | null
  isLastAttempt: boolean
  customMessage?: string
}

export interface PaymentIntentFailedEmailData {
  customerEmail: string
  customerName: string
  currentPlan: string
  targetPlan: string
  failureType: string
  amountFailed: number
  failureReason: string
  billingReason: string | null
  customMessage?: string
}
