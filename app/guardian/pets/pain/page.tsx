'use client'

import AwesomeIcon from '@/app/components/common/AwesomeIcon'
import { heartBeatIcon, plusIcon } from '@/app/lib/icons'
import { setOpenPainScoreDrawer } from '@/app/redux/features/petSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { PainScore } from '@/app/types/model.types'
import React from 'react'
import GuardianPageHeader from '@/app/components/guardian/GuardianPageHeader'
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const formatDate = (dateStr: Date) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatDateFull = (dateStr: Date) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const getPainConfig = (score: number) => {
  const configs = {
    0: {
      label: 'No Pain',
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      badgeBg: 'bg-green-100',
      ringColor: 'ring-green-200'
    },
    1: {
      label: 'Mild',
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      icon: Activity,
      iconColor: 'text-blue-500',
      badgeBg: 'bg-blue-100',
      ringColor: 'ring-blue-200'
    },
    2: {
      label: 'Moderate',
      color: 'text-yellow-600',
      bgGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-500',
      badgeBg: 'bg-yellow-100',
      ringColor: 'ring-yellow-200'
    },
    3: {
      label: 'Severe',
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      badgeBg: 'bg-orange-100',
      ringColor: 'ring-orange-200'
    },
    4: {
      label: 'Extreme',
      color: 'text-red-600',
      bgGradient: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      badgeBg: 'bg-red-100',
      ringColor: 'ring-red-200'
    }
  }
  return configs[score as keyof typeof configs] || configs[0]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
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
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
}

const PainScoring = () => {
  const dispatch = useAppDispatch()
  const { zeroPainScores, painScores } = useAppSelector((state: RootState) => state.pet)

  return (
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <GuardianPageHeader
          Icon={Activity}
          data={painScores}
          title="Pain Scores"
          subtitle="Monitor your pets' comfort levels"
          setOpenDrawer={setOpenPainScoreDrawer}
          btnText="Add Pain Scsore"
          overlayGradient="bg-gradient-to-r from-red-500/10 to-orange-500/10"
          iconGradient="bg-gradient-to-br from-red-500 to-orange-500"
          buttonGradient="bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        />
        {zeroPainScores ? (
          <div className="mt-24">
            <div className="max-w-80 mx-auto w-full">
              <div className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-md">
                <AwesomeIcon icon={heartBeatIcon} className="w-5 h-5 text-zinc-400" />
              </div>
              <h1 className="text-xl text-[#21252c] font-bold my-3">Start by adding a pain score</h1>
              <button
                onClick={() => dispatch(setOpenPainScoreDrawer())}
                className="bg-indigo-500 text-white text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1"
              >
                <AwesomeIcon icon={plusIcon} className="text-white w-3 h-3" />
                Add pain score
              </button>
            </div>
          </div>
        ) : (
          <motion.div className="pt-4" variants={containerVariants} initial="hidden" animate="visible">
            <div className="space-y-4">
              {painScores?.map((painScore: PainScore) => {
                const config = getPainConfig(painScore.score)
                const IconComponent = config.icon

                return (
                  <motion.div
                    key={painScore.id}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden bg-gradient-to-r ${config.bgGradient} border-2 ${config.borderColor} rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                  >
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-30">
                      <motion.div
                        className={`absolute top-0 right-0 w-20 h-20 ${config.badgeBg} rounded-full blur-xl`}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                      <motion.div
                        className={`absolute bottom-0 left-0 w-16 h-16 ${config.badgeBg} rounded-full blur-lg`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative flex items-center justify-between">
                      {/* Left side - Pet info and pain score */}
                      <div className="flex items-center space-x-4">
                        {/* Pet avatar */}
                        <motion.div
                          className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm border border-white/40"
                          whileHover={{ rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <span className="text-lg">{painScore.pet.type === 'DOG' ? '🐶' : '🐱'}</span>
                        </motion.div>

                        {/* Pet name and pain info */}
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">{painScore.pet.name}</h3>
                            <motion.div
                              className={`flex items-center space-x-2 px-3 py-1 ${config.badgeBg} rounded-full border ${config.borderColor}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              <IconComponent className={`w-4 h-4 ${config.iconColor}`} />
                              <span className={`font-bold text-sm ${config.color}`}>
                                {painScore.score} - {config.label}
                              </span>
                            </motion.div>
                          </div>

                          {painScore.notes && (
                            <motion.p
                              className="text-sm text-gray-600 italic max-w-md"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              &quot;{painScore.notes}&quot;
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Right side - Time info */}
                      <div className="text-right flex-shrink-0">
                        <motion.div
                          className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-bold text-gray-900 text-sm">{formatDate(painScore.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-500">{formatDateFull(painScore.createdAt)}</p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${config.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}
                      initial={false}
                    />

                    {/* Pulse indicator for high pain scores */}
                    {painScore.score >= 3 && (
                      <motion.div
                        className={`absolute top-3 right-3 w-3 h-3 ${config.iconColor.replace(
                          'text-',
                          'bg-'
                        )} rounded-full`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PainScoring
