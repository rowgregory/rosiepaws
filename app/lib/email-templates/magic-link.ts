const magicLinkTemplate = (url: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Your App</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 60px; height: 60px; background: #6366f1; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
        </svg>
      </div>
      <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 600;">Sign in to Your App</h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 16px;">Click the button below to sign in securely</p>
    </div>

    <!-- Sign In Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${url}" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500; font-size: 16px;">
        Sign In
      </a>
    </div>

    <!-- Alternative Link -->
    <div style="margin: 24px 0; padding: 16px; background: #f3f4f6; border-radius: 8px;">
      <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 500;">Or copy this link:</p>
      <p style="margin: 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #6366f1;">
        ${url}
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        This link expires in 15 minutes. If you didn't request this, you can ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
`

export default magicLinkTemplate
