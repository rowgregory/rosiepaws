import { PaymentFailedEmailData } from '@/app/types/resend'

const paymentFailedTemplate = (data: PaymentFailedEmailData) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Issue - Action Required</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 60px; height: 60px; background: linear-gradient(to right, #ef4444, #f97316, #eab308); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
      </div>
      <h1 style="margin: 0; background: linear-gradient(to right, #ef4444, #f97316, #eab308); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: 700;">Payment Issue Detected</h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 18px;">We need your attention to keep your account active</p>
    </div>

    <!-- Alert Box -->
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin-right: 8px;">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <strong style="color: #ef4444; font-size: 14px;">${data.isLastAttempt ? 'Final Payment Attempt' : `Payment Attempt ${data.attemptCount}`}</strong>
      </div>
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        ${
          data.isLastAttempt
            ? `This is our final attempt to process your payment for the <strong>${data.planName}</strong> plan. Please update your payment method immediately to avoid service interruption.`
            : `We couldn't process your payment for the <strong>${data.planName}</strong> plan. This was attempt ${data.attemptCount} of 3.`
        }
      </p>
    </div>

    <!-- Payment Details -->
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 16px; font-weight: 600;">Payment Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div>
          <span style="color: #6b7280;">Account:</span>
          <div style="color: #111827; font-weight: 500;">${data.customerEmail}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Plan:</span>
          <div style="color: #111827; font-weight: 500;">${data.planName}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Amount Due:</span>
          <div style="color: #111827; font-weight: 500;">$${data.amountDue.toFixed(2)}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Attempt:</span>
          <div style="color: #ef4444; font-weight: 500;">${data.attemptCount} of 3</div>
        </div>
        ${
          data.nextAttemptDate
            ? `
        <div style="grid-column: span 2;">
          <span style="color: #6b7280;">Next Attempt:</span>
          <div style="color: #111827; font-weight: 500;">${data.nextAttemptDate}</div>
        </div>
        `
            : ''
        }
      </div>
    </div>

    ${
      data.customMessage
        ? `
    <!-- Custom Message -->
    <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Important Notice</h4>
      <p style="margin: 0; color: #1e40af; font-size: 14px;">${data.customMessage}</p>
    </div>
    `
        : ''
    }

    <!-- Action Buttons -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.invoiceUrl}" style="display: inline-block; background: linear-gradient(to right, #ef4444, #f97316, #eab308); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); margin-right: 12px;">
        ${data.isLastAttempt ? 'Update Payment Now' : 'Review & Pay Invoice'}
      </a>
      <a href="https://rosiepaws.com/billing" style="display: inline-block; background: white; color: #374151; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; border: 1px solid #d1d5db;">
        Manage Billing
      </a>
    </div>

    <!-- What Happened -->
    <div style="margin: 24px 0; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <h4 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 600;">What happened?</h4>
      <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px;">
        <li style="margin-bottom: 6px;">Your payment method was declined</li>
        <li style="margin-bottom: 6px;">Insufficient funds or expired card</li>
        <li style="margin-bottom: 6px;">Bank security restrictions</li>
        <li style="margin-bottom: 6px;">Billing address mismatch</li>
      </ul>
    </div>

    <!-- How to Fix -->
    <div style="margin: 24px 0; padding: 20px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
      <h4 style="margin: 0 0 12px 0; color: #047857; font-size: 16px; font-weight: 600;">How to fix this:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #065f46; font-size: 14px;">
        <li style="margin-bottom: 6px;">Update your payment method with a valid card</li>
        <li style="margin-bottom: 6px;">Ensure sufficient funds are available</li>
        <li style="margin-bottom: 6px;">Verify billing address matches your bank records</li>
        <li style="margin-bottom: 6px;">Contact your bank if the issue persists</li>
      </ul>
    </div>

    ${
      data.isLastAttempt
        ? `
    <!-- Final Warning -->
    <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin-right: 8px;">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <strong style="color: #ef4444; font-size: 16px;">Service Interruption Warning</strong>
      </div>
      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 500;">
        If payment is not received soon, your account will be downgraded to the free plan and premium features will be disabled.
      </p>
    </div>
    `
        : ''
    }

    <!-- Need Help -->
    <div style="text-align: center; margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
      <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Need Help?</h4>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
        If you're having trouble updating your payment method or have questions about this charge
      </p>
      <a href="mailto:support@rosiepaws.com" style="color: #6366f1; text-decoration: none; font-weight: 500; font-size: 14px;">
        Contact Support →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
        This is an automated notification. If you recently updated your payment method, please disregard this email.
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Rosie Paws. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`

export default paymentFailedTemplate
