const planChangeSuccessTemplate = (
  customerEmail: string,
  previousPlan: string,
  newPlan: string,
  planPrice: number,
  transactionId: string,
  nextBillingDate: string,
  changeType: 'upgrade' | 'downgrade',
  customMessage?: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plan Change Successful</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 60px; height: 60px; background: linear-gradient(to right, #ec4899, #f97316, #ef4444); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h1 style="margin: 0; background: linear-gradient(to right, #ec4899, #f97316, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: 700;">${changeType === 'upgrade' ? 'Plan Upgrade Complete!' : 'Plan Change Complete!'}</h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 18px;">${changeType === 'upgrade' ? 'Welcome to your enhanced subscription' : 'Your plan has been successfully updated'}</p>
    </div>

    <!-- Success Box -->
    <div style="background: #fdf2f8; border: 1px solid #f9a8d4; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" style="margin-right: 8px;">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <strong style="color: #ec4899; font-size: 14px;">${changeType === 'upgrade' ? 'Upgrade' : 'Plan Change'} Processed Successfully</strong>
      </div>
      <p style="margin: 0; color: #be185d; font-size: 14px;">
        ${
          changeType === 'upgrade'
            ? `Congratulations! You've successfully upgraded from <strong>${previousPlan}</strong> to <strong>${newPlan}</strong>. Your enhanced features are now active.`
            : `Your plan has been changed from <strong>${previousPlan}</strong> to <strong>${newPlan}</strong>. The change is effective immediately.`
        }
      </p>
    </div>

    <!-- Transaction Details -->
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 16px; font-weight: 600;">${changeType === 'upgrade' ? 'Upgrade' : 'Plan Change'} Summary</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div>
          <span style="color: #6b7280;">Account:</span>
          <div style="color: #111827; font-weight: 500;">${customerEmail}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Previous Plan:</span>
          <div style="color: #6b7280; font-weight: 500;">${previousPlan}</div>
        </div>
        <div>
          <span style="color: #6b7280;">New Plan:</span>
          <div style="color: #111827; font-weight: 500;">${newPlan}</div>
        </div>
        <div>
          <span style="color: #6b7280;">${planPrice > 0 ? 'Amount Charged:' : 'Prorated Credit:'}</span>
          <div style="color: #111827; font-weight: 500;">${planPrice > 0 ? `$${planPrice.toFixed(2)}` : `$${Math.abs(planPrice).toFixed(2)} credit`}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Transaction ID:</span>
          <div style="color: #111827; font-weight: 500; font-family: monospace; font-size: 12px;">${transactionId}</div>
        </div>
        <div>
          <span style="color: #6b7280;">Next Billing Date:</span>
          <div style="color: #111827; font-weight: 500;">${nextBillingDate}</div>
        </div>
        <div style="grid-column: span 2;">
          <span style="color: #6b7280;">Status:</span>
          <div style="color: #ec4899; font-weight: 500;">✓ Active & Current</div>
        </div>
      </div>
    </div>

    ${
      customMessage
        ? `
    <!-- Custom Message -->
    <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Message from Our Team</h4>
      <p style="margin: 0; color: #1e40af; font-size: 14px;">${customMessage}</p>
    </div>
    `
        : ''
    }

    <!-- Quick Actions -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://rosiepaws.com/auth/login" style="display: inline-block; background: linear-gradient(to right, #ec4899, #f97316, #ef4444); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(236, 72, 153, 0.3);">
        Access Dashboard
      </a>
    </div>

    <!-- What's Included -->
    <div style="margin: 24px 0; padding: 20px; background: #fdf2f8; border-radius: 8px; border-left: 4px solid #ec4899;">
      <h4 style="margin: 0 0 12px 0; color: #be185d; font-size: 16px; font-weight: 600;">Your ${newPlan} includes:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #9d174d; font-size: 14px;">
        <li style="margin-bottom: 6px;">Full access to all premium features</li>
        <li style="margin-bottom: 6px;">Priority customer support</li>
        <li style="margin-bottom: 6px;">Advanced analytics and reporting</li>
        <li style="margin-bottom: 6px;">Unlimited usage within plan limits</li>
      </ul>
    </div>

    <!-- Manage Subscription -->
    <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" style="margin-right: 8px;">
          <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
        </svg>
        <strong style="color: #a16207; font-size: 14px;">Manage Your Subscription</strong>
      </div>
      <p style="margin: 0; color: #a16207; font-size: 12px;">
        You can update your payment method, change plans, or manage your subscription at any time 
        through your account dashboard.
      </p>
    </div>

    <!-- Need Help -->
    <div style="text-align: center; margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
      <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Questions?</h4>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
        If you have questions about your payment or subscription, we're here to help
      </p>
      <a href="mailto:support@rosiepaws.com" style="color: #6366f1; text-decoration: none; font-weight: 500; font-size: 14px;">
        Contact Support →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
        This is an automated receipt for your subscription payment. Please keep this for your records.
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Rosie Paws. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`

export default planChangeSuccessTemplate
