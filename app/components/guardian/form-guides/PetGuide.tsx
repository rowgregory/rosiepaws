import React, { FC, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Info, Sparkles, Award, ChevronRight } from 'lucide-react'
import { PET_STATS, PET_TIPS } from '@/app/lib/constants'

export const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
}

const PetGuide: FC = () => {
  const [activeTab, setActiveTab] = useState<'tips' | 'stats'>('tips')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col flex-1 w-full max-w-md bg-white shadow-xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Pet Profile Wizard</h3>
          </div>
          <p className="text-center text-white/90 text-sm">
            Complete guide to creating the perfect pet profile for optimal care
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-50 border-b border-slate-200">
        {[
          { id: 'tips', label: 'Tips', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'stats', label: 'Stats', icon: <Award className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-indigo-600 bg-white shadow-sm border-b-2 border-indigo-500'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'tips' && (
            <motion.div
              key="tips"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {PET_TIPS.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative p-4 ${tip.color} border rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      {tip.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{tip.title}</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-white/80 text-slate-700 rounded-full">
                          {tip.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{tip.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 gap-4"
            >
              {PET_STATS.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mb-3 group-hover:shadow-md transition-shadow">
                    {stat.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-slate-700 mb-1">{stat.label}</div>
                    <div className="text-xs text-slate-500 leading-tight">{stat.description}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <Info className="w-4 h-4 text-indigo-500" />
          <span className="text-sm text-indigo-700 font-medium">Complete profiles unlock advanced recommendations</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PetGuide
