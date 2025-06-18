export const COMMON_MEDICATIONS = [
  'Acepromazine',
  'Adequan',
  'Amoxicillin',
  'Amoxicillin/Clavulanate',
  'Apoquel',
  'Atopica',
  'Azithromycin',
  'Baytril',
  'Benadryl',
  'Bravecto',
  'Carprofen',
  'Cephalexin',
  'Cerenia',
  'Chlorpheniramine',
  'Ciprofloxacin',
  'Clindamycin',
  'Cosequin',
  'Cytopoint',
  'Dasuquin',
  'Denamarin',
  'Deramaxx',
  'Dexamethasone',
  'Doxycycline',
  'Dramamine',
  'Enalapril',
  'Enrofloxacin',
  'Famotidine',
  'Firocoxib',
  'Fluconazole',
  'Frontline',
  'Furosemide',
  'Gabapentin',
  'Heartgard',
  'Hydroxyzine',
  'Imodium',
  'Interceptor',
  'Itraconazole',
  'Ketoconazole',
  'Loperamide',
  'Maropitant',
  'Meloxicam',
  'Metoclopramide',
  'Metronidazole',
  'Minocycline',
  'Nexgard',
  'Omeprazole',
  'Penicillin',
  'Pepcid',
  'Phenobarbital',
  'Pimobendan',
  'Prednisolone',
  'Prednisone',
  'Previcox',
  'Proin',
  'Pyrantel',
  'Rimadyl',
  'Robaxin',
  'Sentinel',
  'Simparica',
  'Soloxine',
  'Sucralfate',
  'Sulfamethoxazole/Trimethoprim',
  'Temaril-P',
  'Tetracycline',
  'Theophylline',
  'Thyro-Tabs',
  'Tramadol',
  'Trazodone',
  'Trilostane',
  'Tylosin',
  'Vanectyl-P',
  'Vetmedin',
  'Vetoryl',
  'Zeniquin',
  'Zonisamide',
  'Zyrtec'
]

export const DOSAGE_UNITS = ['mg', 'ml', 'tablets', 'capsules', 'drops', 'pumps', 'units']

export const FREQUENCIES = [
  { value: 'once_daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily (BID)' },
  { value: 'three_times_daily', label: 'Three times daily (TID)' },
  { value: 'four_times_daily', label: 'Four times daily (QID)' },
  { value: 'every_8_hours', label: 'Every 8 hours' },
  { value: 'every_12_hours', label: 'Every 12 hours' },
  { value: 'as_needed', label: 'As needed (PRN)' },
  { value: 'custom', label: 'Custom frequency' }
]

export const DEFAULT_REMINDER_TIMES = ['08:00', '12:00', '18:00', '22:00']

export const TIME_ZONE_OPTIONS = [
  { value: -11, label: 'UTC-11 (Hawaii)' },
  { value: -10, label: 'UTC-10 (Alaska)' },
  { value: -9, label: 'UTC-9 (Alaska)' },
  { value: -8, label: 'UTC-8 (PST - Los Angeles)' },
  { value: -7, label: 'UTC-7 (MST - Denver)' },
  { value: -6, label: 'UTC-6 (CST - Chicago)' },
  { value: -5, label: 'UTC-5 (EST - New York)' }
]

export const getDefaultReminderTimes = (frequency: string) => {
  switch (frequency) {
    case 'once_daily':
      return ['08:00']
    case 'twice_daily':
    case 'every_12_hours':
      return ['08:00', '20:00']
    case 'three_times_daily':
      return ['08:00', '14:00', '20:00']
    case 'four_times_daily':
    case 'every_8_hours':
      return ['08:00', '14:00', '20:00', '02:00']
    default:
      return []
  }
}

export const isMedicationFormValid = (inputs: any) => {
  return inputs?.petId && inputs?.drugName && inputs.dosage && inputs.dosageUnit && inputs.frequency && inputs.startDate
}
