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

export const PillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {/* Pill bottle body */}
    <motion.rect
      x="8"
      y="10"
      width="8"
      height="12"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
    />
    {/* Bottle cap */}
    <motion.rect
      x="9"
      y="7"
      width="6"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    />
    {/* Label line 1 */}
    <motion.line
      x1="10"
      y1="13"
      x2="14"
      y2="13"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
    />
    {/* Label line 2 */}
    <motion.line
      x1="10"
      y1="15"
      x2="14"
      y2="15"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
    />
    {/* Cross symbol */}
    <motion.path
      d="M11 3h2v4h-2zM9 5h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
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
