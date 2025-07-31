import {
  appointmentCreateTokenCost,
  bloodSugarCreateTokenCost,
  feedingCreateTokenCost,
  medicationCreateTokenCost,
  movementCreateTokenCost,
  painScoreCreateTokenCost,
  seizureCreateTokenCost,
  walkCreateTokenCost,
  waterCreateTokenCost
} from '@/app/lib/constants/public/token'
import { Activity, Calendar, Droplets, Footprints, Heart, Navigation, Pill, Utensils, Zap } from 'lucide-react'
import { setOpenPainScoreCreateDrawer } from '@/app/redux/features/painScoreSlice'
import { setOpenBloodSugarCreateDrawer } from '@/app/redux/features/bloodSugarSlice'
import { setOpenFeedingCreateDrawer } from '@/app/redux/features/feedingSlice'
import { setOpenWaterCreateDrawer } from '@/app/redux/features/waterSlice'
import { setOpenMedicationCreateDrawer } from '@/app/redux/features/medicationSlice'
import { setOpenSeizureCreateDrawer } from '@/app/redux/features/seizureSlice'
import { setOpenAppointmentCreateDrawer } from '@/app/redux/features/appointmentSlice'
import { setOpenMovementCreateDrawer } from '@/app/redux/features/movementSlice'
import { setOpenWalkCreateDrawer } from '@/app/redux/features/walkSlice'

export const metricConfigButton = {
  'blood-sugars': {
    action: setOpenBloodSugarCreateDrawer(),
    label: 'Blood Sugar',
    tokens: bloodSugarCreateTokenCost
  },
  'pain-scores': {
    action: setOpenPainScoreCreateDrawer(),
    label: 'Pain Score',
    tokens: painScoreCreateTokenCost
  },
  feedings: {
    action: setOpenFeedingCreateDrawer(),
    label: 'Feeding',
    tokens: feedingCreateTokenCost
  },
  waters: {
    action: setOpenWaterCreateDrawer(),
    label: 'Water Intake',
    tokens: waterCreateTokenCost
  },
  medications: {
    action: setOpenMedicationCreateDrawer(),
    label: 'Medication',
    tokens: medicationCreateTokenCost
  },
  seizures: {
    action: setOpenSeizureCreateDrawer(),
    label: 'Seizure',
    tokens: seizureCreateTokenCost
  },
  appointments: {
    action: setOpenAppointmentCreateDrawer(),
    label: 'Appointment',
    tokens: appointmentCreateTokenCost
  },
  movements: {
    action: setOpenMovementCreateDrawer(),
    label: 'Movement',
    tokens: movementCreateTokenCost
  },
  walks: {
    action: setOpenWalkCreateDrawer(),
    label: 'Walk',
    tokens: walkCreateTokenCost
  }
}

export const metricsConfigCards = (stats: any) => [
  {
    id: 'pain-scores',
    title: 'Pain Level',
    value: `${stats.painScores?.mostRecent ?? 'No data'}/4`, // Show most recent score
    subtitle: `Weekly avg: ${stats.painScores?.average || 0}/4 • ${stats.painScores?.totalLogs || 0} log${stats.painScores?.totalLogs !== 1 ? 's' : ''}`,
    icon: Activity,
    color: 'orange',
    trend: stats.painScores?.trend,
    hasLogs: stats.painScores?.hasPainScores,
    totalLogs: stats.painScores?.totalLogs
  },
  {
    id: 'feedings',
    title: 'Feedings',
    value: `${stats.feedings?.mostRecent ?? 'No data'} cups`, // Show most recent score
    subtitle: `Weekly avg: ${stats.feedings?.average || 0} cups • ${stats.feedings?.totalLogs || 0} log${stats.feedings?.totalLogs !== 1 ? 's' : ''}`,
    icon: Utensils,
    color: 'green',
    trend: stats.feedings?.trend,
    hasLogs: stats.feedings?.hasFeedings,
    totalLogs: stats.feedings?.totalLogs
  },
  {
    id: 'waters',
    title: 'Water Intake',
    value: `${stats.waters?.mostRecent ?? 'No data'}ml`, // Show most recent milliliters
    subtitle: `Weekly avg: ${stats.waters?.average || 0}ml • ${stats.waters?.totalLogs || 0} log${stats.waters?.totalLogs !== 1 ? 's' : ''}`,
    icon: Droplets,
    color: 'blue',
    trend: stats.waters?.trend,
    hasLogs: stats.waters?.hasWaters,
    totalLogs: stats.waters?.totalLogs
  },
  {
    id: 'walks',
    title: 'Walk Intake',
    value: `${stats.walks?.mostRecent ?? 'No data'}mi`, // Show most recent distance
    subtitle: `Weekly avg: ${stats.walks?.average || 0}ml • ${stats.walks?.totalLogs || 0} log${stats.walks?.totalLogs !== 1 ? 's' : ''}`,
    icon: Footprints,
    color: 'gray',
    trend: stats.walks?.trend,
    hasLogs: stats.walks?.hasWalks,
    totalLogs: stats.walks?.totalLogs
  },
  {
    id: 'movements',
    title: 'Movements',
    value: `${stats.movements?.mostRecent ?? 'No data'}mins`, // Show most recent distance
    subtitle: `Weekly avg: ${stats.movements?.average || 0}ml • ${stats.movements?.totalLogs || 0} log${stats.movements?.totalLogs !== 1 ? 's' : ''}`,
    icon: Navigation,
    color: 'cyan',
    trend: stats.movements?.trend,
    hasLogs: stats.movements?.hasMovements,
    totalLogs: stats.movements?.totalLogs
  },
  {
    id: 'medications',
    title: 'Medications',
    value: `${stats.medications?.mostRecent ?? 'No data'}`, // Show most recent distance
    subtitle: `${stats.medications?.dosage || 0}${stats.medications?.dosageUnit} • ${stats.medications?.totalLogs || 0} log${stats.medications?.totalLogs !== 1 ? 's' : ''}`,
    icon: Pill,
    color: 'purple',
    trend: '--',
    hasLogs: stats.medications?.hasMedications,
    totalLogs: stats.medications?.totalLogs
  },
  {
    id: 'appointments',
    title: 'Appointments',
    value: `${stats.appointments?.mostRecent ?? 'No data'}`, // Show most recent distance
    subtitle: `${stats.appointments?.date} • ${stats.appointments?.totalLogs || 0} log${stats.appointments?.totalLogs !== 1 ? 's' : ''}`,
    icon: Calendar,
    color: 'fuchsia',
    trend: '--',
    hasLogs: stats.appointments?.hasAppointments,
    totalLogs: stats.appointments?.totalLogs
  },
  {
    id: 'blood-sugars',
    title: 'Blood Sugar',
    value: stats.bloodSugars?.mostRecent ? `${stats.bloodSugars.mostRecent} mg/dL` : 'No data',
    subtitle: `Weekly avg: ${stats.bloodSugars?.average || 0} mg/dL • ${stats.bloodSugars?.totalLogs || 0} log${stats.movements?.totalLogs !== 1 ? 's' : ''}`,
    icon: Heart,
    color: 'red',
    trend: stats.bloodSugars?.trend,
    hasLogs: stats.bloodSugars?.hasBloodSugars,
    totalLogs: stats.bloodSugars?.totalLogs
  },
  {
    id: 'seizures',
    title: 'Seizures',
    value: stats.seizures?.mostRecent ? `${stats.seizures.mostRecent}secs` : 'No data',
    subtitle: `Weekly avg: ${stats.seizures?.average || 0} secs • ${stats.seizures?.totalLogs || 0} log${stats.movements?.totalLogs !== 1 ? 's' : ''}`,
    icon: Zap,
    color: 'orange',
    trend: stats.seizures?.trend,
    hasLogs: stats.seizures?.hasSeizures,
    totalLogs: stats.seizures?.totalLogs
  }
]
