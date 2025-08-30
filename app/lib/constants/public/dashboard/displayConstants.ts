import {
  appointmentCreateTokenCost,
  feedingCreateTokenCost,
  movementCreateTokenCost,
  painScoreCreateTokenCost,
  vitalSignsCreateTokenCost,
  waterCreateTokenCost
} from '@/app/lib/constants/public/token'
import { Activity, Calendar, Droplets, Heart, Hospital, Navigation, Pill, Utensils, Zap } from 'lucide-react'
import { setOpenPainDrawer } from '@/app/redux/features/painSlice'
import { setOpenBloodSugarDrawer } from '@/app/redux/features/bloodSugarSlice'
import { setOpenFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { setOpenWaterDrawer } from '@/app/redux/features/waterSlice'
import { setOpenMedicationDrawer } from '@/app/redux/features/medicationSlice'
import { setOpenSeizureDrawer } from '@/app/redux/features/seizureSlice'
import { setOpenAppointmentDrawer } from '@/app/redux/features/appointmentSlice'
import { setOpenMovementDrawer } from '@/app/redux/features/movementSlice'
import { setOpenVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'

export const metricConfigButton = {
  'blood-sugars': {
    action: setOpenBloodSugarDrawer(),
    label: 'Blood Sugar',
    tokens: 0
  },
  'pain-scores': {
    action: setOpenPainDrawer(),
    label: 'Pain Score',
    tokens: painScoreCreateTokenCost
  },
  feedings: {
    action: setOpenFeedingDrawer(),
    label: 'Feeding',
    tokens: feedingCreateTokenCost
  },
  waters: {
    action: setOpenWaterDrawer(),
    label: 'Water',
    tokens: waterCreateTokenCost
  },
  medications: {
    action: setOpenMedicationDrawer(),
    label: 'Medication',
    tokens: 0
  },
  seizures: {
    action: setOpenSeizureDrawer(),
    label: 'Seizure',
    tokens: 0
  },
  appointments: {
    action: setOpenAppointmentDrawer(),
    label: 'Appointment',
    tokens: appointmentCreateTokenCost
  },
  movements: {
    action: setOpenMovementDrawer(),
    label: 'Movement',
    tokens: movementCreateTokenCost
  },
  'vital-signs': {
    action: setOpenVitalSignsDrawer(),
    label: 'Vital Signs',
    tokens: vitalSignsCreateTokenCost
  }
}

export const metricsConfigCards = (stats: any) => [
  {
    id: 'pain-scores',
    title: 'Pain Level',
    value: `${stats?.painScores?.mostRecent ?? 'No data'}/4`, // Show most recent score
    subtitle: `Weekly avg: ${stats?.painScores?.average || 0}/4 • ${stats?.painScores?.totalLogs || 0} log${stats?.painScores?.totalLogs !== 1 ? 's' : ''}`,
    icon: Activity,
    color: 'orange',
    trend: stats?.painScores?.trend,
    hasLogs: stats?.painScores?.hasPainScores,
    totalLogs: stats?.painScores?.totalLogs
  },
  {
    id: 'feedings',
    title: 'Feedings',
    value: `${stats?.feedings?.mostRecent ?? 'No data'} cups`, // Show most recent score
    subtitle: `Weekly avg: ${stats?.feedings?.average || 0} cups • ${stats?.feedings?.totalLogs || 0} log${stats?.feedings?.totalLogs !== 1 ? 's' : ''}`,
    icon: Utensils,
    color: 'green',
    trend: stats?.feedings?.trend,
    hasLogs: stats?.feedings?.hasFeedings,
    totalLogs: stats?.feedings?.totalLogs
  },
  {
    id: 'waters',
    title: 'Water Intake',
    value: `${stats?.waters?.mostRecent ?? 'No data'}ml`, // Show most recent milliliters
    subtitle: `Weekly avg: ${stats?.waters?.average || 0}ml • ${stats?.waters?.totalLogs || 0} log${stats?.waters?.totalLogs !== 1 ? 's' : ''}`,
    icon: Droplets,
    color: 'blue',
    trend: stats?.waters?.trend,
    hasLogs: stats?.waters?.hasWaters,
    totalLogs: stats?.waters?.totalLogs
  },
  {
    id: 'vital-signs',
    title: 'Vital Signs',
    value: `${stats?.vitalSigns?.mostRecent ?? 'No data'}mi`,
    subtitle: `Weekly avg: ${stats?.vitalSigns?.average || 0}ml • ${stats?.vitalSigns?.totalLogs || 0} log${stats?.vitalSigns?.totalLogs !== 1 ? 's' : ''}`,
    icon: Hospital,
    color: 'gray',
    trend: stats?.vitalSigns?.trend,
    hasLogs: stats?.vitalSigns?.hasVitalSigns,
    totalLogs: stats?.vitalSigns?.totalLogs
  },
  {
    id: 'movements',
    title: 'Movements',
    value: `${stats?.movements?.mostRecent ?? 'No data'}mins`, // Show most recent distance
    subtitle: `Weekly avg: ${stats?.movements?.average || 0}ml • ${stats?.movements?.totalLogs || 0} log${stats?.movements?.totalLogs !== 1 ? 's' : ''}`,
    icon: Navigation,
    color: 'cyan',
    trend: stats?.movements?.trend,
    hasLogs: stats?.movements?.hasMovements,
    totalLogs: stats?.movements?.totalLogs
  },
  {
    id: 'appointments',
    title: 'Appointments',
    value: `${stats?.appointments?.mostRecent ?? 'No data'}`, // Show most recent distance
    subtitle: `${stats?.appointments?.date} • ${stats?.appointments?.totalLogs || 0} log${stats?.appointments?.totalLogs !== 1 ? 's' : ''}`,
    icon: Calendar,
    color: 'fuchsia',
    trend: '--',
    hasLogs: stats?.appointments?.hasAppointments,
    totalLogs: stats?.appointments?.totalLogs
  },
  {
    id: 'medications',
    title: 'Medications',
    value: `${stats?.medications?.mostRecent ?? 'No data'}`, // Show most recent distance
    subtitle: `${stats?.medications?.dosage || 0}${stats?.medications?.dosageUnit} • ${stats?.medications?.totalLogs || 0} log${stats?.medications?.totalLogs !== 1 ? 's' : ''}`,
    icon: Pill,
    color: 'purple',
    trend: '--',
    hasLogs: stats?.medications?.hasMedications,
    totalLogs: stats?.medications?.totalLogs
  },
  {
    id: 'blood-sugars',
    title: 'Blood Sugar',
    value: stats?.bloodSugars?.mostRecent ? `${stats?.bloodSugars.mostRecent} mg/dL` : 'No data',
    subtitle: `Weekly avg: ${stats?.bloodSugars?.average || 0} mg/dL • ${stats?.bloodSugars?.totalLogs || 0} log${stats?.movements?.totalLogs !== 1 ? 's' : ''}`,
    icon: Heart,
    color: 'red',
    trend: stats?.bloodSugars?.trend,
    hasLogs: stats?.bloodSugars?.hasBloodSugars,
    totalLogs: stats?.bloodSugars?.totalLogs
  },
  {
    id: 'seizures',
    title: 'Seizures',
    value: stats?.seizures?.mostRecent ? `${stats?.seizures.mostRecent}secs` : 'No data',
    subtitle: `Weekly avg: ${stats?.seizures?.average || 0} secs • ${stats?.seizures?.totalLogs || 0} log${stats?.movements?.totalLogs !== 1 ? 's' : ''}`,
    icon: Zap,
    color: 'orange',
    trend: stats?.seizures?.trend,
    hasLogs: stats?.seizures?.hasSeizures,
    totalLogs: stats?.seizures?.totalLogs
  }
]
