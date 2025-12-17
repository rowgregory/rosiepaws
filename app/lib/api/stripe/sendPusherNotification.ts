import { pusher } from '../../pusher/pusher'
import { createLog } from '../createLog'

async function sendPusherNotification(userId: string, data: any) {
  try {
    await pusher.trigger(`user`, 'plan-purchased', data)

    await createLog('info', 'Pusher notification sent', {
      location: ['webhook - sendPusherNotification'],
      userId: userId,
      notificationType: data.type,
      planName: data.planName
    })
  } catch (error) {
    await createLog('error', 'Failed to send Pusher notification', {
      location: ['webhook - sendPusherNotification'],
      userId: userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default sendPusherNotification
