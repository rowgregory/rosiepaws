export const cardVariants = (index: number): any => ({
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: index * 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
})

export const hoverVariants: any = {
  scale: 1.02,
  y: -4,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 25
  }
}

export const contentVariants = (index: number): any => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2 + index * 0.1
    }
  }
})

export const itemVariants: any = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
}

export const statusBadgeVariants: any = (index: number) => ({
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: 0.3 + index * 0.1
    }
  }
})

export const timeChipVariants: any = (index: number) => ({
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: 0.5 + index * 0.1 + i * 0.05
    }
  })
})

export const nextDoseVariants: any = (index: number) => ({
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: 0.4 + index * 0.1
    }
  }
})

// Pulse animation for overdue medications
export const pulseVariants = (status: { status: string }) =>
  status.status === 'overdue'
    ? {
        scale: [1, 1.02, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    : {}
