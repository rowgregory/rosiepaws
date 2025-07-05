import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  AlertTriangle,
  Clock,
  Phone,
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
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseEmergencySignsDrawer } from '../redux/features/dashboardSlice'

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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">Emergency Signs Guide</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-semibold">When in doubt, call your vet!</span>
                  </div>
                  <p className="text-sm text-red-100">
                    This guide helps identify serious symptoms but doesn&apos;t replace professional veterinary
                    judgment.
                  </p>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-600 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    <span className="font-semibold">24/7 Pet Emergency: (555) 123-4567</span>
                  </div>
                </div>
              </div>

              {/* Tabs and Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setActiveTab('dogs')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      activeTab === 'dogs' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🐕 Dogs
                  </button>
                  <button
                    onClick={() => setActiveTab('cats')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      activeTab === 'cats' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🐱 Cats
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {filteredSigns.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div
                        className={`bg-gradient-to-r ${category.color} text-white p-4 cursor-pointer`}
                        onClick={() => toggleSection(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {category.icon}
                            <div className="ml-3">
                              <h3 className="text-lg font-bold">{category.category}</h3>
                              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                                {category.urgency}
                              </span>
                            </div>
                          </div>
                          {expandedSections[category.id] ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSections[category.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-6 space-y-4">
                              {category.signs.map((sign, index) => (
                                <div
                                  key={index}
                                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-lg font-semibold text-gray-800">{sign.symptom}</h4>
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        sign.timeframe.includes('Immediate') || sign.timeframe.includes('Minutes')
                                          ? 'bg-red-100 text-red-800'
                                          : sign.timeframe.includes('hours')
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                      }`}
                                    >
                                      {sign.timeframe}
                                    </span>
                                  </div>

                                  <p className="text-gray-600 mb-3">{sign.description}</p>

                                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                                    <p className="text-blue-800 font-medium">
                                      <strong>Action:</strong> {sign.action}
                                    </p>
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
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No symptoms found matching &quot;{searchTerm}&quot;</p>
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
