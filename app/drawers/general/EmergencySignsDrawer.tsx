import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  AlertTriangle,
  Clock,
  Heart,
  Thermometer,
  Zap,
  Activity,
  Wind,
  Droplets,
  Brain,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setCloseEmergencySignsDrawer } from '@/app/redux/features/dashboardSlice'

const EmergencySignsDrawer = () => {
  const [activeTab, setActiveTab] = useState('dogs')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState({}) as any
  const { emergencySignsDrawer } = useAppSelector((state: RootState) => state.dashboard)
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseEmergencySignsDrawer())

  const toggleSection = (sectionId: any) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const emergencySignsDogs = [
    {
      id: 'breathing',
      category: 'Breathing & Respiratory',
      icon: <Wind className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      urgency: 'Immediate',
      signs: [
        {
          symptom: 'Difficulty Breathing',
          description: 'Labored breathing, gasping, or open-mouth breathing while at rest',
          action: 'Get to emergency vet immediately - this is life-threatening',
          timeframe: 'Minutes matter'
        },
        {
          symptom: 'Blue or Purple Gums/Tongue',
          description: 'Indicates lack of oxygen (cyanosis)',
          action: 'Emergency vet now - oxygen deprivation can cause brain damage',
          timeframe: 'Immediate'
        },
        {
          symptom: 'Choking Sounds',
          description: 'Gagging, retching, or inability to bark normally',
          action: 'Check for visible objects in mouth, attempt removal if safe, then emergency vet',
          timeframe: 'Act immediately'
        }
      ]
    },
    {
      id: 'cardiac',
      category: 'Heart & Circulation',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      urgency: 'Immediate',
      signs: [
        {
          symptom: 'Collapse or Fainting',
          description: 'Sudden loss of consciousness or falling over',
          action: 'Check airway, begin CPR if no pulse, rush to emergency vet',
          timeframe: 'Every second counts'
        },
        {
          symptom: 'Pale or White Gums',
          description: 'Normal gums are pink; pale indicates poor circulation',
          action: 'Emergency vet immediately - possible internal bleeding or shock',
          timeframe: 'Within 30 minutes'
        },
        {
          symptom: 'Rapid or Irregular Heartbeat',
          description: 'Heart rate over 120 bpm at rest or erratic rhythm',
          action: 'Monitor closely and get to vet within hours if persistent',
          timeframe: '2-4 hours if severe'
        }
      ]
    },
    {
      id: 'neurological',
      category: 'Neurological',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-600',
      urgency: 'Immediate',
      signs: [
        {
          symptom: 'Seizures',
          description: 'Uncontrolled shaking, paddling, loss of consciousness',
          action: 'Do not restrain, time the seizure, protect from injury, vet immediately if over 5 minutes',
          timeframe: 'If continuous or repeated'
        },
        {
          symptom: 'Sudden Blindness',
          description: 'Bumping into objects, dilated pupils, confusion',
          action: 'Emergency vet - could indicate stroke or severe hypertension',
          timeframe: 'Same day'
        },
        {
          symptom: 'Progressive Movement Reluctance',
          description:
            'Starting with reluctance to move, progressing to yelping when picked up, eventually leading to complete inability to move',
          action:
            'Document progression, handle very gently, emergency vet for neurological evaluation - may indicate spinal injury, severe pain, or hydrocephalus',
          timeframe: 'Progressive - seek help immediately'
        },
        {
          symptom: 'Head Tilt or Circling',
          description: 'Walking in circles, head tilted to one side, loss of balance',
          action: 'Neurological emergency - get to vet immediately',
          timeframe: 'Within hours'
        }
      ]
    },
    {
      id: 'digestive',
      category: 'Digestive Emergencies',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-600',
      urgency: 'Urgent',
      signs: [
        {
          symptom: 'Bloating/Distended Abdomen',
          description: 'Swollen, hard belly, especially in large breed dogs',
          action: 'Emergency vet NOW - gastric torsion can be fatal within hours',
          timeframe: 'Immediate'
        },
        {
          symptom: 'Repeated Vomiting',
          description: 'Multiple episodes, especially with blood or coffee-ground appearance',
          action: 'Withhold food, offer small amounts of water, vet within 24 hours',
          timeframe: '12-24 hours'
        },
        {
          symptom: 'Inability to Defecate',
          description: 'Straining without producing stool, crying in pain',
          action: 'Check for obstruction, emergency vet if severe straining',
          timeframe: '24-48 hours'
        }
      ]
    },
    {
      id: 'pain',
      category: 'Severe Pain Indicators',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-600',
      urgency: 'Urgent',
      signs: [
        {
          symptom: 'Crying or Whimpering',
          description: 'Continuous vocalization, especially when touched',
          action: 'Assess for injury, provide comfort, vet evaluation needed',
          timeframe: 'Same day'
        },
        {
          symptom: 'Inability to Move',
          description: 'Paralysis, dragging limbs, or extreme reluctance to move',
          action: 'Do not move unnecessarily, stabilize spine, emergency vet',
          timeframe: 'Immediate'
        },
        {
          symptom: 'Aggressive When Touched',
          description: 'Normally gentle dog becomes defensive about specific area',
          action: 'Suspect injury or pain, handle carefully, vet examination',
          timeframe: 'Within 24 hours'
        }
      ]
    }
  ]

  const emergencySignsCats = [
    {
      id: 'breathing-cats',
      category: 'Breathing & Respiratory',
      icon: <Wind className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      urgency: 'Immediate',
      signs: [
        {
          symptom: 'Open-Mouth Breathing',
          description: 'Cats rarely pant - open-mouth breathing is emergency',
          action: 'Emergency vet immediately - sign of severe distress',
          timeframe: 'Minutes matter'
        },
        {
          symptom: 'Rapid Breathing at Rest',
          description: 'Over 30 breaths per minute while resting',
          action: 'Count respirations, emergency vet if over 40/minute',
          timeframe: 'Within hours'
        },
        {
          symptom: 'Blue Gums or Tongue',
          description: 'Cyanosis indicating oxygen deprivation',
          action: 'Oxygen emergency - get to vet immediately',
          timeframe: 'Immediate'
        }
      ]
    },
    {
      id: 'urinary-cats',
      category: 'Urinary Blockage',
      icon: <Droplets className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      urgency: 'Immediate',
      signs: [
        {
          symptom: 'Straining to Urinate',
          description: 'Multiple trips to litter box with little/no urine production',
          action: 'Emergency vet NOW - urinary blockage can be fatal in 24-48 hours',
          timeframe: 'Immediate'
        },
        {
          symptom: 'Crying in Litter Box',
          description: 'Vocalization while attempting to urinate',
          action: 'Check for urine output, emergency vet if no urine produced',
          timeframe: 'Within 6 hours'
        },
        {
          symptom: 'Blood in Urine',
          description: 'Pink, red, or brown colored urine',
          action: 'Collect sample if possible, vet evaluation needed',
          timeframe: 'Same day'
        }
      ]
    },
    {
      id: 'neurological-cats',
      category: 'Neurological',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-600',
      urgency: 'Immediate',
      signs: [
        {
          symptom: 'Sudden Paralysis',
          description: 'Inability to use back legs (saddle thrombus)',
          action: 'Do not move cat, emergency vet - blood clot emergency',
          timeframe: 'Immediate'
        },
        {
          symptom: 'Seizures',
          description: 'Convulsions, paddling, loss of consciousness',
          action: 'Protect from injury, time seizure, vet if over 5 minutes',
          timeframe: 'If continuous'
        },
        {
          symptom: 'Head Pressing',
          description: 'Pressing head against walls or objects',
          action: 'Neurological emergency - immediate vet attention',
          timeframe: 'Within hours'
        }
      ]
    },
    {
      id: 'digestive-cats',
      category: 'Digestive Issues',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      urgency: 'Urgent',
      signs: [
        {
          symptom: 'Not Eating for 24+ Hours',
          description: 'Complete loss of appetite in cats is serious',
          action: 'Try favorite foods, if still refusing, vet evaluation needed',
          timeframe: 'Within 24 hours'
        },
        {
          symptom: 'Repeated Vomiting',
          description: 'Multiple episodes, especially with blood',
          action: 'Withhold food briefly, offer water, vet if continues',
          timeframe: '12-24 hours'
        },
        {
          symptom: 'Drooling Excessively',
          description: 'Unusual for cats - may indicate nausea or toxicity',
          action: 'Check mouth for foreign objects, vet evaluation',
          timeframe: 'Same day'
        }
      ]
    },
    {
      id: 'temperature-cats',
      category: 'Temperature Regulation',
      icon: <Thermometer className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      urgency: 'Monitor',
      signs: [
        {
          symptom: 'Hypothermia',
          description: 'Body temperature below 99°F, cold to touch',
          action: 'Warm gradually with blankets, vet evaluation needed',
          timeframe: 'Within hours'
        },
        {
          symptom: 'Hyperthermia',
          description: 'Body temperature above 104°F, panting, lethargy',
          action: 'Cool gradually, offer water, emergency vet if severe',
          timeframe: 'Monitor closely'
        },
        {
          symptom: 'Hiding Behavior',
          description: 'Sudden withdrawal, hiding in unusual places',
          action: 'Often indicates illness in cats - gentle examination needed',
          timeframe: 'Within 24-48 hours'
        }
      ]
    }
  ]

  const filteredSigns = (activeTab === 'dogs' ? emergencySignsDogs : emergencySignsCats).filter(
    (category) =>
      category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.signs.some(
        (sign) =>
          sign.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sign.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  return (
    <AnimatePresence>
      {emergencySignsDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-500 rounded-xl mr-4">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">Emergency Signs Reference</h2>
                      <p className="text-slate-300 text-sm mt-1">Veterinary Emergency Assessment Guide</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 bg-opacity-50 border border-slate-600 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 mr-3 text-amber-400" />
                      <span className="font-medium text-slate-100">Professional Assessment Required</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      This reference guide assists in identifying critical symptoms but does not substitute for
                      professional veterinary diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation and Search */}
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('dogs')}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === 'dogs'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="ml-2">Canine</span>
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('cats')}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === 'cats'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="ml-2">Feline</span>
                      </span>
                    </button>
                  </div>

                  <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search symptoms or conditions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 bg-slate-50">
                <div className="space-y-4">
                  {filteredSigns.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div
                        className={`bg-gradient-to-r ${category.color} text-white p-6 cursor-pointer hover:opacity-95 transition-opacity`}
                        onClick={() => toggleSection(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-white bg-opacity-20 rounded-xl mr-4">{category.icon}</div>
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{category.category}</h3>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                                {category.urgency}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm mr-3 opacity-75">
                              {category.signs.length} {category.signs.length === 1 ? 'sign' : 'signs'}
                            </span>
                            {expandedSections[category.id] ? (
                              <ChevronUp className="w-6 h-6" />
                            ) : (
                              <ChevronDown className="w-6 h-6" />
                            )}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSections[category.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                          >
                            <div className="p-6 space-y-4 bg-slate-50">
                              {category.signs.map((sign, index) => (
                                <div
                                  key={index}
                                  className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-all duration-200"
                                >
                                  <div className="flex items-start justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-slate-800 leading-tight">
                                      {sign.symptom}
                                    </h4>
                                    <span
                                      className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                        sign.timeframe.includes('Immediate') || sign.timeframe.includes('Minutes')
                                          ? 'bg-red-100 text-red-700 border border-red-200'
                                          : sign.timeframe.includes('hours')
                                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                      }`}
                                    >
                                      {sign.timeframe}
                                    </span>
                                  </div>

                                  <p className="text-slate-600 mb-4 leading-relaxed">{sign.description}</p>

                                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-start">
                                      <div className="p-1 bg-blue-100 rounded-lg mr-3 mt-0.5">
                                        <AlertTriangle className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="text-blue-900 font-medium mb-1">Recommended Action</p>
                                        <p className="text-blue-800 text-sm leading-relaxed">{sign.action}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {filteredSigns.length === 0 && (
                  <div className="text-center py-16">
                    <div className="p-4 bg-slate-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">No Results Found</h3>
                    <p className="text-slate-500">
                      No symptoms found matching <span className="font-medium">&quot;{searchTerm}&quot;</span>
                    </p>
                    <p className="text-slate-400 text-sm mt-2">Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EmergencySignsDrawer
