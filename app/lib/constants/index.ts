export const MOOD_EMOJIS = ['😴', '😐', '🙂', '😋', '🤤']

export const InputStyle =
  'w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300'

export const CheckboxStyle = 'rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'

export const COLORS = ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6']

export const drawerVariants = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' }
}

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const cardVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: 'easeOut'
    }
  })
}

export * from './public/blood-sugar'
export * from './public/feeding'
export * from './public/medication'
export * from './public/pain'
export * from './public/vital-signs'
export * from './public/water'
export * from './public/movement'
export * from './public/appointment'
export * from './public/pet'
export * from './public/seizure'
export * from './public/info'
export * from './admin/dashboard'
