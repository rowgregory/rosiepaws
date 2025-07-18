import { Variants } from 'framer-motion'

export const MOOD_EMOJIS = ['😴', '😐', '🙂', '😋', '🤤']

export const InputStyle =
  'w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300'

export const CheckboxStyle = 'rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'

export const ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export * from './blood-sugar'
export * from './feeding'
export * from './medication'
export * from './pain'
export * from './walk'
export * from './water'
export * from './movement'
export * from './appointment'
export * from './pet'
export * from './seizure'
export * from './info'
