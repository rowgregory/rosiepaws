import { ILog } from '@/app/types'
import { isLogRecent, isLogToday } from './dateUtils'

export interface LogStats {
  total: number
  error: number
  warn: number
  info: number
  debug: number
  last24Hours: number
  todayCount: number
}

export const calculateLogStats = (logs: ILog[]): LogStats => {
  return {
    total: logs.length,
    error: logs.filter((l) => l.level === 'error').length,
    warn: logs.filter((l) => l.level === 'warn').length,
    info: logs.filter((l) => l.level === 'info').length,
    debug: logs.filter((l) => l.level === 'debug').length,
    last24Hours: logs.filter((l) => isLogRecent(l, 24)).length,
    todayCount: logs.filter((l) => isLogToday(l)).length
  }
}
