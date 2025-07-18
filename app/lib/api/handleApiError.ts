import { NextRequest, NextResponse } from 'next/server'
import { createLog } from './createLog'
import { parseStack } from 'error-stack-parser-es/lite'
import { getErrorMessage } from './getErrorMessage'

interface ErrorHandlerOptions {
  error: any
  req: NextRequest
  action: string
  sliceName: string
  statusCode?: number
}

export async function handleApiError({
  error,
  req,
  action,
  sliceName,
  statusCode = 500
}: ErrorHandlerOptions): Promise<NextResponse> {
  const errorMessage = getErrorMessage(error) || error.message || 'An unexpected error occurred'

  // Log the error
  await createLog('error', `${action} failed: ${error.message}`, {
    errorLocation: parseStack(JSON.stringify(error)),
    errorMessage: error.message,
    errorName: error.name || 'UnknownError',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    action
  })

  // Return standardized error response
  return NextResponse.json(
    {
      message: `${action} failed`,
      error: errorMessage,
      sliceName
    },
    { status: statusCode }
  )
}
