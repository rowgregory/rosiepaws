import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import magicLinkTemplate from '@/app/lib/email-templates/magic-link-template'
import { sliceAuth } from '@/public/data/api.data'
import { NextRequest } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, url, from } = await req.json()

    const { data, error } = await resend.emails.send({
      from: from,
      to: email,
      subject: 'Sign in to Your App',
      html: magicLinkTemplate(url)
    })

    if (error) {
      await createLog('warning', `Error when sending magic link to ${email}`, {
        location: [`api route - ${req.method} ${req.url}`],
        name: 'MagicLinkNotSent',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        email
      })
      return Response.json({ error: error.message }, { status: 500 })
    }

    await createLog('info', 'Sent magic link successfully', {
      location: ['api route - POST /api/auth/send-verification'],
      name: 'SentMagicLink',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      magicLinkId: data?.id,
      email
    })

    return Response.json({ success: true, id: data?.id })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Send magic link',
      sliceName: sliceAuth
    })
  }
}
