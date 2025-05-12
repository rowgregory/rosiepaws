import prisma from '@/prisma/client'

export async function createLog(level: string, message: string, metadata?: any) {
  await prisma.log.create({
    data: {
      level,
      message,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    }
  })
}

export const getErrorMessage = (error: any) => {
  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof (error as any).data === 'object' &&
    'message' in (error as any).data
  ) {
    return (error as any).data.message
  }

  return undefined
}
