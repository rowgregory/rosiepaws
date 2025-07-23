const createRefundNotificationEmail = (
  customerEmail: string,
  planName: string,
  refundAmount: number,
  receiptNumber: string,
  reason?: string
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund Confirmation</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 60px; height: 60px; background: #22c55e; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h1 style="margin: 0; color: #059669; font-size: 28px; font-weight: 700;">Refund Processed</h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 18px;">Your payment has been successfully refunded</p>
    </div>

    <!-- Refund Details -->
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; color: #059669; font-size: 18px; font-weight: 600;">Refund Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div>
          <span style="color: #6b7280;">Amount Refunded:</span>
          <div style="color: #111827; font-weight: 600; font-size: 18px;">$${refundAmount.toFixed(2)}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Plan:</span>
          <div style="color: #111827; font-weight: 500;">${planName}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Receipt Number:</span>
          <div style="color: #111827; font-weight: 500; font-family: monospace;">${receiptNumber}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Processing Time:</span>
          <div style="color: #111827; font-weight: 500;">5-10 business days</div>
        </div>
      </div>
    </div>

    ${
      reason
        ? `
    <!-- Reason -->
    <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Refund Reason</h4>
      <p style="margin: 0; color: #1e40af; font-size: 14px;">${reason}</p>
    </div>
    `
        : ''
    }

    <!-- What to Expect -->
    <div style="margin: 24px 0; padding: 20px; background: #fefce8; border-radius: 8px; border-left: 4px solid #eab308;">
      <h4 style="margin: 0 0 12px 0; color: #a16207; font-size: 16px; font-weight: 600;">What to expect:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #a16207; font-size: 14px;">
        <li style="margin-bottom: 6px;">Refund will appear on your original payment method</li>
        <li style="margin-bottom: 6px;">Processing typically takes 5-10 business days</li>
        <li style="margin-bottom: 6px;">You'll see it as a credit on your statement</li>
        <li style="margin-bottom: 6px;">Keep this email as your receipt</li>
      </ul>
    </div>

    <!-- Account Status -->
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h4 style="margin: 0 0 12px 0; color: #374151; font-size: 16px; font-weight: 600;">Your Account</h4>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Your account and subscription status remain unchanged unless otherwise noted. 
        If you have any questions about this refund or your subscription, please contact our support team.
      </p>
    </div>

    <!-- Support -->
    <div style="text-align: center; margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
      <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Questions?</h4>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
        If you have any questions about this refund or need assistance
      </p>
      <a href="mailto:support@yourapp.com" style="color: #6366f1; text-decoration: none; font-weight: 500; font-size: 14px;">
        Contact Support →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
        This refund confirmation was sent to ${customerEmail}
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Your App Name. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export default createRefundNotificationEmail
