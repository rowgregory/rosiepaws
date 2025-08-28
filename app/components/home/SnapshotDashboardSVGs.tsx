import { motion } from 'framer-motion'

// Animated SVG Icons
export const HeartRateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <motion.path
      d="M22 12h-4l-3 9L9 3l-3 9H2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  </svg>
)

export const FeedingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <motion.path
      d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97L6.75 22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
    />
  </svg>
)

export const WaterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {/* Main water drop */}
    <motion.path
      d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    />
  </svg>
)

export const VitalSignsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {/* Heart rate line */}
    <motion.path
      d="M3 12h4l2-4 4 8 2-4h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Heart shape */}
    <motion.path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ scale: 0.8, opacity: 0.6 }}
      animate={{ scale: [0.8, 1, 0.8], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </svg>
)

export const MovementIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {/* Person/pet body */}
    <motion.circle
      cx="12"
      cy="8"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0.9 }}
      animate={{ scale: [0.9, 1, 0.9] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Movement path/trail */}
    <motion.path
      d="M6 16c2-2 4-1 6 0s4 2 6 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0.5 }}
      animate={{ pathLength: 1, opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    />

    {/* Activity indicators (dots showing movement) */}
    <motion.circle
      cx="8"
      cy="18"
      r="1"
      fill="currentColor"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    />

    <motion.circle
      cx="12"
      cy="19"
      r="1"
      fill="currentColor"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
    />

    <motion.circle
      cx="16"
      cy="18"
      r="1"
      fill="currentColor"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
    />
  </svg>
)

export const PillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {/* Pill bottle body */}
    <motion.path
      d="M8 10h8v12H8z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
    />
    {/* Bottle cap */}
    <motion.path
      d="M9 7h6v3H9z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    />
    {/* Label line 1 */}
    <motion.path
      d="M10 13h4"
      stroke="currentColor"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
    />
    {/* Label line 2 */}
    <motion.path
      d="M10 15h4"
      stroke="currentColor"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    />
    {/* Cross symbol */}
    <motion.path
      d="M11.5 3v4M9.5 5h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
  </svg>
)

export const AppointmentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <motion.path
      d="M8 2v2M16 2v2M3 8h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="16"
      cy="16"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
    <motion.path
      d="M16 14v2l1 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
  </svg>
)

export const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <motion.path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Heartbeat line inside */}
    <motion.path
      d="M8 12h2l1-3 2 6 2-3 1 2h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </svg>
)

export const LightningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {/* Brain outline */}
    <motion.path
      d="M9.5 2C7 2 5 4 5 6.5c0 1 .5 2 1 2.5C4.5 10 4 11.5 4 13c0 2.5 2 4.5 4.5 4.5.5 0 1-.1 1.5-.3.5.7 1.2 1.3 2 1.3s1.5-.6 2-1.3c.5.2 1 .3 1.5.3 2.5 0 4.5-2 4.5-4.5 0-1.5-.5-3-1.5-4 .5-.5 1-1.5 1-2.5C19 4 17 2 14.5 2c-1 0-2 .4-2.5 1C11.5 2.4 10.5 2 9.5 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Lightning bolt inside brain */}
    <motion.path
      d="M10 8l2-2v3l2 2-2 2v-3l-2-2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </svg>
)
