import { PaymentIntentFailedEmailData } from '@/app/types/resend'

const paymentIntentPaymentFailedTemplate = (data: PaymentIntentFailedEmailData) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Issue - ${data.failureType === 'plan_change' ? 'Upgrade Failed' : 'Payment Failed'}</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 60px; height: 60px; background: linear-gradient(to right, #f59e0b, #ef4444, #dc2626); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
      </div>
      <h1 style="margin: 0; background: linear-gradient(to right, #f59e0b, #ef4444, #dc2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: 700;">
        ${
          data.failureType === 'plan_change'
            ? 'Upgrade Payment Failed'
            : data.failureType === 'initial_subscription'
              ? 'Subscription Payment Failed'
              : 'Payment Issue'
        }
      </h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 18px;">
        ${data.failureType === 'plan_change' ? 'Your plan upgrade could not be processed' : 'We need your attention to process your payment'}
      </p>
    </div>

    <!-- Alert Box -->
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin-right: 8px;">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <strong style="color: #ef4444; font-size: 14px;">Payment Declined</strong>
      </div>
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        <strong>Reason:</strong> ${data.failureReason}
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
          <span style="color: #6b7280;">Current Plan:</span>
          <div style="color: #111827; font-weight: 500;">${data.currentPlan}</div>
        </div>
        ${
          data.failureType === 'plan_change'
            ? `
        <div>
          <span style="color: #6b7280;">Attempted Upgrade:</span>
          <div style="color: #111827; font-weight: 500;">${data.targetPlan}</div>
        </div>
        `
            : `
        <div>
          <span style="color: #6b7280;">Plan:</span>
          <div style="color: #111827; font-weight: 500;">${data.targetPlan}</div>
        </div>
        `
        }
        <div>
          <span style="color: #6b7280;">Amount:</span>
          <div style="color: #111827; font-weight: 500;">$${data.amountFailed.toFixed(2)}</div>
        </div>
      </div>
    </div>

    ${
      data.customMessage
        ? `
    <!-- Custom Message -->
    <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">What happened?</h4>
      <p style="margin: 0; color: #1e40af; font-size: 14px;">${data.customMessage}</p>
    </div>
    `
        : ''
    }

    <!-- Action Buttons -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://rosiepaws.com/dashboard" style="display: inline-block; background: white; color: #374151; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; border: 1px solid #d1d5db;">
        Go to Dashboard
      </a>
    </div>

    ${
      data.failureType === 'plan_change'
        ? `
    <!-- Plan Change Info -->
    <div style="margin: 24px 0; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
      <h4 style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 16px; font-weight: 600;">No worries!</h4>
      <ul style="margin: 0; padding-left: 20px; color: #075985; font-size: 14px;">
        <li style="margin-bottom: 6px;">You'll remain on your current ${data.currentPlan} plan</li>
        <li style="margin-bottom: 6px;">All your features and tokens are preserved</li>
        <li style="margin-bottom: 6px;">You can try upgrading again anytime</li>
        <li style="margin-bottom: 6px;">Update your payment method for future upgrades</li>
      </ul>
    </div>
    `
        : `
    <!-- General Payment Info -->
    <div style="margin: 24px 0; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <h4 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 600;">Common reasons for payment failure:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px;">
        <li style="margin-bottom: 6px;">Insufficient funds in your account</li>
        <li style="margin-bottom: 6px;">Expired or invalid card information</li>
        <li style="margin-bottom: 6px;">Bank security restrictions</li>
        <li style="margin-bottom: 6px;">Billing address mismatch</li>
      </ul>
    </div>
    `
    }

    <!-- How to Fix -->
    <div style="margin: 24px 0; padding: 20px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
      <h4 style="margin: 0 0 12px 0; color: #047857; font-size: 16px; font-weight: 600;">How to resolve this:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #065f46; font-size: 14px;">
        <li style="margin-bottom: 6px;">Update your payment method with a valid card</li>
        <li style="margin-bottom: 6px;">Ensure sufficient funds are available</li>
        <li style="margin-bottom: 6px;">Verify billing address matches your bank records</li>
        <li style="margin-bottom: 6px;">Contact your bank if the issue persists</li>
      </ul>
    </div>

    <!-- Need Help -->
    <div style="text-align: center; margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
      <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Need Help?</h4>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
        If you're having trouble with your payment or have questions about this charge
      </p>
      <a href="mailto:support@rosiepaws.com" style="color: #6366f1; text-decoration: none; font-weight: 500; font-size: 14px;">
        Contact Support →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
        This is an automated notification. You can update your payment method anytime in your account settings.
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Rosie Paws. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`

export default paymentIntentPaymentFailedTemplate
