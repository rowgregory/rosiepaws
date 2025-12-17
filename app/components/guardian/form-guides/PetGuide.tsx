import { FC, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Camera, Activity, HelpCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'

export const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
}

// Form-specific guidance data
const FORM_TIPS = [
  {
    section: 'Basic Information',
    icon: <User className="w-4 h-4 text-blue-600" />,
    color: 'bg-blue-50 border-blue-200',
    tips: [
      {
        field: 'Pet Name',
        advice: 'Use their primary name for vet records and identification',
        example: 'Max, Luna, Charlie',
        importance: 'Essential'
      },
      {
        field: 'Pet Type & Breed',
        advice: 'Specific breed info helps organize data and enables better tracking views',
        example: 'Golden Retriever, Maine Coon, Mixed Breed',
        importance: 'Essential'
      }
    ]
  },
  {
    section: 'Photo/Video',
    icon: <Camera className="w-4 h-4 text-pink-600" />,
    color: 'bg-pink-50 border-pink-200',
    tips: [
      {
        field: 'Best Photos',
        advice: 'Clear photos help with visual identification and creating a complete profile',
        example: 'Front-facing, full body, good lighting',
        importance: 'Important'
      },
      {
        field: 'File Format',
        advice: 'HEIC photos are automatically converted. Videos capture personality',
        example: 'JPG, PNG, MP4, MOV (up to 10MB)',
        importance: 'Optional'
      }
    ]
  },
  {
    section: 'Physical Details',
    icon: <Activity className="w-4 h-4 text-green-600" />,
    color: 'bg-green-50 border-green-200',
    tips: [
      {
        field: 'Age Accuracy',
        advice: 'Precise age enables better data tracking and timeline visualizations',
        example: '2 years 3 months, 6 months, 8 years',
        importance: 'Critical'
      },
      {
        field: 'Weight Tracking',
        advice: 'Accurate weight data creates meaningful charts and trend graphs',
        example: '15 lbs, 45 lbs, 8.5 lbs',
        importance: 'Important'
      }
    ]
  }
]

const COMPLETION_BENEFITS = [
  {
    percentage: '100%',
    title: 'Complete Profile',
    description: 'Access comprehensive charts, trends, and detailed health history views',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    color: 'bg-green-50 border-green-200'
  },
  {
    percentage: '75%',
    title: 'Nearly There',
    description: 'Unlock advanced data visualizations and weight tracking graphs',
    icon: <Activity className="w-5 h-5 text-blue-600" />,
    color: 'bg-blue-50 border-blue-200'
  },
  {
    percentage: '50%',
    title: 'Good Start',
    description: 'Basic profile display and simple data organization available',
    icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
    color: 'bg-orange-50 border-orange-200'
  }
]

const PetGuide: FC = () => {
  const [activeTab, setActiveTab] = useState<'guidance' | 'benefits'>('guidance')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col flex-1 w-full max-w-md bg-white shadow-xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Profile Guide</h3>
          </div>
          <p className="text-center text-white/90 text-sm">
            Tips for creating an organized and complete pet data profile
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-50 border-b border-slate-200">
        {[
          { id: 'guidance', label: 'Form Tips', icon: <Lightbulb className="w-4 h-4" /> },
          { id: 'benefits', label: 'Benefits', icon: <CheckCircle className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-blue-600 bg-white shadow-sm border-b-2 border-blue-500'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'guidance' && (
            <motion.div
              key="guidance"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {FORM_TIPS.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm border">{section.icon}</div>
                    <h4 className="font-semibold text-slate-900 text-sm">{section.section}</h4>
                  </div>

                  {section.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className={`p-3 ${section.color} rounded-lg border`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-slate-900 text-xs">{tip.field}</span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            tip.importance === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : tip.importance === 'Essential'
                                ? 'bg-orange-100 text-orange-700'
                                : tip.importance === 'Important'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tip.importance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">{tip.advice}</p>
                      <div className="text-xs text-slate-500">
                        <span className="font-medium">Example: </span>
                        {tip.example}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div
              key="benefits"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {COMPLETION_BENEFITS.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 ${benefit.color} rounded-lg border hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">{benefit.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-slate-900">{benefit.percentage}</span>
                        <h4 className="font-semibold text-slate-900 text-sm">{benefit.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900 text-sm">Data Tip</span>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Complete profiles enable better data visualization, detailed charts, and comprehensive tracking views
                  of your pet&apos;s information over time.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">Better data creates better insights for you</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PetGuide
