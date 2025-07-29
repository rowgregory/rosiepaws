import { createLog } from '@/app/lib/api/createLog'
import { handleApiError } from '@/app/lib/api/handleApiError'
import { SETTINGS_BACKUP_FREQUENCIES_STR_ARR } from '@/app/lib/constants/admin/settings'
import prisma from '@/prisma/client'
import { sliceAdmin } from '@/public/data/api.data'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const { frequency } = await req.json()

    // Validate frequency
    if (!SETTINGS_BACKUP_FREQUENCIES_STR_ARR.includes(frequency)) {
      return NextResponse.json({ message: 'Invalid frequency', sliceName: sliceAdmin }, { status: 400 })
    }

    await prisma.setting.upsert({
      where: { key: 'backupFrequency' },
      update: { value: frequency },
      create: {
        key: 'backupFrequency',
        value: frequency
      }
    })

    await createLog('info', 'Backup frequency updated successfully', {
      location: ['api route - PATCH /api/admin/update-backup-frequency'],
      name: 'BackupFrequencyUpdated',
      timestamp: new Date().toISOString(),
      newFrequency: frequency,
      url: req.url,
      method: req.method
    })

    return NextResponse.json({
      frequency
    })
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Settings backup frequency update',
      sliceName: sliceAdmin
    })
  }
}
