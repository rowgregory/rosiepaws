const updatePaymentTemplate = (
  updateUrl: string,
  customerEmail: string,
  planName: string,
  planPrice: number,
  customMessage?: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Your Payment Method</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 60px; height: 60px; background: #ef4444; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M3 5.5a2.5 2.5 0 0 1 2.5-2.5h12a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5h-12a2.5 2.5 0 0 1-2.5-2.5v-13z"/>
          <path d="M7 2v4M17 2v4M7 14h5M7 18h3"/>
        </svg>
      </div>
      <h1 style="margin: 0; color: #dc2626; font-size: 28px; font-weight: 700;">Payment Action Required</h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 18px;">We need to update your payment information</p>
    </div>

    <!-- Alert Box -->
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" style="margin-right: 8px;">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <strong style="color: #dc2626; font-size: 14px;">Payment Issue Detected</strong>
      </div>
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        We encountered an issue processing your payment for the <strong>${planName}</strong> plan. 
        Please update your payment method to avoid service interruption.
      </p>
    </div>

    <!-- Account Details -->
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 16px; font-weight: 600;">Account Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div>
          <span style="color: #6b7280;">Email:</span>
          <div style="color: #111827; font-weight: 500;">${customerEmail}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Current Plan:</span>
          <div style="color: #111827; font-weight: 500;">${planName}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Monthly Amount:</span>
          <div style="color: #111827; font-weight: 500;">$${planPrice.toFixed(2)}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Status:</span>
          <div style="color: #dc2626; font-weight: 500;">Payment Required</div>
        </div>
      </div>
    </div>

    ${
      customMessage
        ? `
    <!-- Custom Message -->
    <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Message from Support</h4>
      <p style="margin: 0; color: #1e40af; font-size: 14px;">${customMessage}</p>
    </div>
    `
        : ''
    }

    <!-- Update Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${updateUrl}" style="display: inline-block; background: #dc2626; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);">
        Update Payment Method
      </a>
    </div>

    <!-- What You Can Do -->
    <div style="margin: 24px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
      <h4 style="margin: 0 0 12px 0; color: #15803d; font-size: 16px; font-weight: 600;">What you can update:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px;">
        <li style="margin-bottom: 6px;">Add a new credit or debit card</li>
        <li style="margin-bottom: 6px;">Update existing card expiration date</li>
        <li style="margin-bottom: 6px;">Change billing address information</li>
        <li style="margin-bottom: 6px;">Switch to a different payment method</li>
      </ul>
    </div>

    <!-- Alternative Link -->
    <div style="margin: 24px 0; padding: 16px; background: #f3f4f6; border-radius: 8px;">
      <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 500;">Or copy this secure link:</p>
      <p style="margin: 0; word-break: break-all; font-family: monospace; font-size: 11px; color: #6366f1; background: white; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb;">
        ${updateUrl}
      </p>
    </div>

    <!-- Security Notice -->
    <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" style="margin-right: 8px;">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <strong style="color: #a16207; font-size: 14px;">Secure & Safe</strong>
      </div>
      <p style="margin: 0; color: #a16207; font-size: 12px;">
        This link is encrypted and secure. It will expire in 24 hours for your protection. 
        We never store your payment information - it's handled securely by our payment processor.
      </p>
    </div>

    <!-- Need Help -->
    <div style="text-align: center; margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
      <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Need Help?</h4>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
        If you're having trouble updating your payment method or have questions about your subscription
      </p>
      <a href="mailto:support@yourapp.com" style="color: #6366f1; text-decoration: none; font-weight: 500; font-size: 14px;">
        Contact Support →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
        This secure link expires in 24 hours. If you didn't expect this email, please contact support.
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Your App Name. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`

export default updatePaymentTemplate
