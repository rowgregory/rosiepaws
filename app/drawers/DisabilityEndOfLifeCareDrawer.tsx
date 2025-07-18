'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Heart,
  Home,
  Phone,
  Users,
  Stethoscope,
  Move,
  Eye,
  Ear,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  Star
} from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseDisabilityEndOfLifeCareDrawer } from '../redux/features/appSlice'

const DisabilityEndOfLifeCareDrawer = () => {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const { disabilityEndOfLifeCareDrawer } = useAppSelector((state: RootState) => state.app)
  const onClose = () => dispatch(setCloseDisabilityEndOfLifeCareDrawer())

  const mainSections = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'disabilities', label: 'Disabilities', icon: Move },
    { id: 'end-of-life', label: 'End-of-Life', icon: Clock },
    { id: 'support', label: 'Support', icon: Users }
  ]

  const disabilityCategories = [
    {
      id: 'mobility',
      title: 'Mobility Issues',
      icon: Move,
      color: 'bg-blue-500',
      conditions: ['Hip Dysplasia', 'Arthritis', 'Paralysis', 'Amputations', 'Luxating Patella'],
      description: 'Supporting dogs and cats with movement challenges'
    },
    {
      id: 'vision',
      title: 'Vision Impairment',
      icon: Eye,
      color: 'bg-purple-500',
      conditions: ['Blindness', 'Cataracts', 'Glaucoma', 'Progressive Retinal Atrophy', 'Cherry Eye'],
      description: 'Helping blind and visually impaired dogs and cats'
    },
    {
      id: 'hearing',
      title: 'Hearing Loss',
      icon: Ear,
      color: 'bg-green-500',
      conditions: ['Deafness', 'Partial Hearing Loss', 'Age-related Hearing Loss', 'Ear Infections'],
      description: 'Caring for deaf and hearing-impaired dogs and cats'
    },
    {
      id: 'cognitive',
      title: 'Cognitive Issues',
      icon: Brain,
      color: 'bg-orange-500',
      conditions: ['Dementia', 'Cognitive Dysfunction', 'Seizure Disorders', 'Hydrocephalus', 'Feline Hyperesthesia'],
      description: 'Managing cognitive and neurological conditions in dogs and cats'
    }
  ]

  const endOfLifeSigns = [
    {
      category: 'Physical Signs',
      color: 'text-red-600',
      signs: [
        'Difficulty breathing or labored breathing',
        'Loss of appetite lasting more than 24 hours',
        'Inability to stand or walk',
        'Severe pain that cannot be managed',
        'Incontinence or loss of bladder/bowel control',
        'Seizures that are increasing in frequency'
      ]
    },
    {
      category: 'Behavioral Changes',
      color: 'text-orange-600',
      signs: [
        'Withdrawal from family interactions',
        'Confusion or disorientation',
        'Restlessness or inability to get comfortable',
        'Loss of interest in favorite activities',
        'Changes in sleep patterns',
        'Hiding or seeking solitude'
      ]
    },
    {
      category: 'Quality of Life Indicators',
      color: 'text-blue-600',
      signs: [
        'More bad days than good days',
        'Unable to enjoy simple pleasures',
        'Dignity compromised by illness',
        'Family quality of life significantly impacted',
        'Treatment no longer improving condition',
        'Suffering outweighs joy'
      ]
    }
  ]

  const qualityOfLifeScale = [
    { factor: 'Hurt', description: 'Pain management and comfort level', weight: 'High Priority' },
    { factor: 'Hunger', description: 'Ability and desire to eat and drink', weight: 'Essential' },
    { factor: 'Hydration', description: 'Proper hydration and fluid balance', weight: 'Critical' },
    { factor: 'Hygiene', description: 'Ability to stay clean and maintain dignity', weight: 'Important' },
    { factor: 'Happiness', description: 'Joy, engagement, and emotional well-being', weight: 'High Priority' },
    { factor: 'Mobility', description: 'Ability to move around comfortably', weight: 'Variable' },
    { factor: 'More Good Days', description: 'Good days outnumber bad days', weight: 'Essential' }
  ]

  const adaptationTips = {
    mobility: [
      'Use ramps instead of stairs for easier access',
      'Provide orthopedic bedding for joint support',
      'Consider mobility aids like wheelchairs or harnesses',
      'Keep food and water bowls at comfortable heights',
      'Use non-slip rugs on smooth surfaces',
      'Maintain regular, gentle exercise as tolerated',
      'For cats: provide low-entry litter boxes',
      'Consider raised feeding stations for comfort'
    ],
    vision: [
      'Keep furniture in the same locations',
      'Use verbal cues and commands consistently',
      'Add textural markers (rugs, mats) for navigation',
      'Keep pathways clear of obstacles',
      'Use scent markers to identify important areas',
      'Approach from the front and speak before touching',
      'For cats: keep litter box location consistent',
      'Add safety barriers to stairs or elevated areas'
    ],
    hearing: [
      'Use visual signals and hand commands',
      'Approach from where they can see you',
      'Use vibrations to get attention (stamp floor)',
      'Keep them on leash in unfenced areas',
      'Use lights or visual cues for communication',
      'Maintain consistent daily routines',
      'For cats: use visual feeding cues',
      'Be extra gentle when waking them'
    ],
    cognitive: [
      'Maintain consistent daily routines',
      'Use night lights to reduce confusion',
      'Keep interactions calm and positive',
      'Provide mental stimulation appropriate to ability',
      'Monitor for anxiety and provide comfort',
      'Discuss medication options with your vet',
      'For cats: keep multiple litter boxes available',
      'Minimize household changes and stress'
    ]
  }

  return (
    <AnimatePresence>
      {disabilityEndOfLifeCareDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Special Care Guide</h2>
                    <p className="text-sm text-gray-600">Disabilities & End-of-Life Support for Dogs & Cats</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {mainSections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeSection === section.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-indigo-200 hover:bg-white/15'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                      <Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Compassionate Care</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Every dog and cat deserves dignity, comfort, and love throughout their life journey. This guide
                        provides evidence-based information to help you care for pets with special needs and navigate
                        end-of-life decisions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <Move className="w-8 h-8 text-blue-600 mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">Disability Support</h4>
                        <p className="text-gray-600 text-sm">
                          Practical guidance for mobility, vision, hearing, and cognitive challenges in dogs and cats
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <Clock className="w-8 h-8 text-purple-600 mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">End-of-Life Care</h4>
                        <p className="text-gray-600 text-sm">
                          Quality of life assessment and compassionate decision-making support
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-amber-900 mb-2">Important Note</h4>
                          <p className="text-amber-800 text-sm leading-relaxed">
                            This information is educational and should complement, not replace, professional veterinary
                            care. Always consult with your veterinarian for personalized medical advice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Disabilities Section */}
                {activeSection === 'disabilities' && (
                  <motion.div
                    key="disabilities"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Disability Categories</h3>
                      <div className="grid gap-4">
                        {disabilityCategories.map((category) => (
                          <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                          >
                            <button
                              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                              className="w-full p-6 text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}
                                >
                                  <category.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{category.title}</h4>
                                  <p className="text-gray-600 text-sm">{category.description}</p>
                                </div>
                                <ArrowRight
                                  className={`w-5 h-5 text-gray-400 transition-transform ${
                                    selectedCategory === category.id ? 'rotate-90' : ''
                                  }`}
                                />
                              </div>
                            </button>

                            <AnimatePresence>
                              {selectedCategory === category.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-gray-100"
                                >
                                  <div className="p-6 bg-gray-50">
                                    <div className="mb-4">
                                      <h5 className="font-medium text-gray-900 mb-2">Common Conditions:</h5>
                                      <div className="flex flex-wrap gap-2">
                                        {category.conditions.map((condition) => (
                                          <span
                                            key={condition}
                                            className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
                                          >
                                            {condition}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h5 className="font-medium text-gray-900 mb-3">Adaptation Tips:</h5>
                                      <ul className="space-y-2">
                                        {adaptationTips[category.id as keyof typeof adaptationTips]?.map(
                                          (tip, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                              {tip}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* End-of-Life Section */}
                {activeSection === 'end-of-life' && (
                  <motion.div
                    key="end-of-life"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Quality of Life Scale */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        HHHHHMM Quality of Life Scale
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Dr. Alice Villalobos&apos; assessment tool to help determine quality of life. Score each factor
                        from 1-10.
                      </p>
                      <div className="space-y-3">
                        {qualityOfLifeScale.map((factor, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-semibold text-sm">{factor.factor[0]}</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{factor.factor}</h5>
                              <p className="text-gray-600 text-sm">{factor.description}</p>
                              <span className="text-xs text-blue-600 font-medium">{factor.weight}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          <strong>Interpretation:</strong> A total score above 35 indicates good quality of life. Scores
                          below 35 suggest it may be time for difficult conversations with your veterinarian.
                        </p>
                      </div>
                    </div>

                    {/* Warning Signs */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        When to Seek Guidance
                      </h3>
                      <div className="space-y-4">
                        {endOfLifeSigns.map((category, index) => (
                          <div key={index}>
                            <h4 className={`font-medium mb-2 ${category.color}`}>{category.category}</h4>
                            <ul className="space-y-1">
                              {category.signs.map((sign, signIndex) => (
                                <li key={signIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                  {sign}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Support Section */}
                {activeSection === 'support' && (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-200">
                      <Users className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re Not Alone</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Caring for a pet with special needs or facing end-of-life decisions is challenging. Professional
                        support and community resources are available to help you through this journey.
                      </p>
                    </div>

                    {/* Emergency Contacts */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Emergency Support
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-red-900">ASPCA Animal Poison Control</p>
                            <p className="text-red-700 text-sm">(888) 426-4435 - 24/7 Emergency</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">Pet Loss Support Hotline</p>
                            <p className="text-blue-700 text-sm">(877) 474-3310 - Grief Counseling</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Services */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Professional Services</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Stethoscope className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Veterinary Specialists</p>
                            <p className="text-gray-600 text-sm">
                              Board-certified specialists in oncology, neurology, and hospice care for dogs and cats
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Home className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">In-Home Care Services</p>
                            <p className="text-gray-600 text-sm">Mobile veterinarians and hospice care providers</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Heart className="w-5 h-5 text-pink-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Pet Therapy & Rehabilitation</p>
                            <p className="text-gray-600 text-sm">
                              Physical therapy, acupuncture, and alternative treatments
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Online Communities */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Online Communities</h4>
                      <div className="grid gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">Special Needs Pets Support Groups</p>
                          <p className="text-gray-600 text-sm">
                            Facebook communities for specific conditions in dogs and cats
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">Rainbow Bridge Memorial</p>
                          <p className="text-gray-600 text-sm">Online memorial and grief support platform</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">The Pet Loss Center</p>
                          <p className="text-gray-600 text-sm">Educational resources and community support</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DisabilityEndOfLifeCareDrawer
