import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Thermometer,
  Heart,
  Activity,
  Weight,
  Eye,
  Droplets,
  Clock,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Video,
  BookOpen
} from 'lucide-react'

const GuardianVitalSignsGuide = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('temperature')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const vitalSignsGuide = [
    {
      id: 'temperature',
      icon: Thermometer,
      title: 'Temperature',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      normalRange: {
        dog: '101-102.5°F',
        cat: '100.5-102.5°F'
      },
      howTo: [
        'Use a digital rectal thermometer (most accurate)',
        'Lubricate thermometer with petroleum jelly',
        'Insert about 1 inch into rectum',
        'Hold for 1-2 minutes until it beeps',
        'Alternative: Use ear thermometer designed for pets'
      ],
      whenToConcern: ['Below 99°F or above 104°F', 'Lethargy with fever', 'Shivering or panting excessively'],
      tips: [
        'Take temperature when pet is calm',
        'Have someone help hold your pet',
        'Clean thermometer before and after use'
      ]
    },
    {
      id: 'heartRate',
      icon: Heart,
      title: 'Heart Rate',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      normalRange: {
        dog: '70-120 bpm',
        cat: '140-220 bpm'
      },
      howTo: [
        'Place hand on left side of chest behind front leg',
        'Feel for heartbeat or pulse',
        'Count beats for 15 seconds, multiply by 4',
        'Alternative: Feel pulse on inside of back leg',
        'Use a stethoscope if available'
      ],
      whenToConcern: [
        'Very slow (<60 bpm) or very fast (>160 bpm for dogs, >240 for cats)',
        'Irregular rhythm',
        'Weak or difficult to find pulse'
      ],
      tips: [
        'Practice when your pet is healthy',
        'Count during rest, not after exercise',
        'Small dogs naturally have faster heart rates'
      ]
    },
    {
      id: 'respiratory',
      icon: Activity,
      title: 'Respiratory Rate',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      normalRange: {
        dog: '10-30 breaths/min',
        cat: '20-30 breaths/min'
      },
      howTo: [
        'Watch chest rise and fall while pet is resting',
        'Count breaths for 15 seconds, multiply by 4',
        'One breath = one inhale + one exhale',
        'Observe from a distance to avoid exciting pet',
        'Count when pet is lying down and calm'
      ],
      whenToConcern: [
        'Rapid breathing at rest (>40 breaths/min)',
        'Labored or difficult breathing',
        'Blue gums or tongue',
        'Open-mouth breathing in cats'
      ],
      tips: [
        'Best measured when pet is sleeping',
        'Avoid counting right after exercise',
        'Panting is not normal breathing'
      ]
    },
    {
      id: 'weight',
      icon: Weight,
      title: 'Weight',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      normalRange: {
        dog: 'Varies by breed',
        cat: '8-12 lbs average'
      },
      howTo: [
        'Use bathroom scale for large dogs',
        'For small pets: weigh yourself, then holding pet',
        'Subtract your weight from combined weight',
        'Use pet scale if available',
        'Weigh at same time of day for consistency'
      ],
      whenToConcern: [
        'Sudden weight loss (>10% in short time)',
        'Gradual weight loss without diet changes',
        'Rapid weight gain'
      ],
      tips: ['Keep a weight log', 'Weigh weekly for sick pets', 'Monthly weighing for healthy pets']
    },
    {
      id: 'mucousMembranes',
      icon: Eye,
      title: 'Gum Color',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      normalRange: {
        dog: 'Pink and moist',
        cat: 'Pink and moist'
      },
      howTo: [
        'Gently lift upper lip to expose gums',
        'Check color above canine teeth',
        'Normal: pink like bubble gum',
        'Should feel moist, not sticky',
        'Check in good lighting'
      ],
      whenToConcern: [
        'White or very pale gums',
        'Blue or purple gums (emergency!)',
        'Yellow gums',
        'Bright red gums',
        'Dry or sticky gums'
      ],
      tips: [
        'Compare to normal when pet is healthy',
        'Some pets have naturally dark gums',
        'Check inner eyelids if gums are dark'
      ]
    },
    {
      id: 'hydration',
      icon: Droplets,
      title: 'Hydration',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      normalRange: {
        dog: 'Skin snaps back quickly',
        cat: 'Skin snaps back quickly'
      },
      howTo: [
        'Gently pinch skin on back of neck',
        'Lift skin up and release',
        'Normal: skin returns immediately',
        'Dehydrated: skin stays "tented" for seconds',
        'Test on scruff area between shoulder blades'
      ],
      whenToConcern: [
        'Skin takes >2 seconds to return',
        'Skin stays tented',
        'Dry gums along with slow skin return',
        'Sunken eyes'
      ],
      tips: [
        'Practice the test when pet is healthy',
        'Older pets may have naturally slower return',
        'Check gums too - should be moist'
      ]
    },
    {
      id: 'capillaryRefill',
      icon: Clock,
      title: 'Capillary Refill',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      normalRange: {
        dog: '<2 seconds',
        cat: '<2 seconds'
      },
      howTo: [
        'Press firmly on gum with finger',
        'Release pressure quickly',
        'Watch for color to return to pink',
        'Time how long it takes',
        'Normal: color returns in 1-2 seconds'
      ],
      whenToConcern: ['Takes longer than 2-3 seconds', 'No color return', 'Gums stay white after pressure'],
      tips: [
        'Use good lighting',
        'Press on upper gum above canine tooth',
        'Practice when pet is healthy to know normal'
      ]
    }
  ]

  return (
    <div className="flex flex-1 flex-col bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-xl font-semibold">At-Home Vital Signs Guide</h2>
        </div>
        <p className="text-blue-100 mt-2 text-sm">Learn how to safely monitor your pet&apos;s health at home</p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-semibold text-sm">Emergency Signs</h3>
            <p className="text-red-700 text-sm mt-1">
              Contact your veterinarian immediately if you see: blue gums, difficulty breathing, temperature below 99°F
              or above 104°F, or if your pet collapses.
            </p>
          </div>
        </div>
      </div>

      {/* Vital Signs Accordion */}
      <div className="p-4 space-y-3">
        {vitalSignsGuide.map((vital) => {
          const Icon = vital.icon
          const isExpanded = expandedSection === vital.id

          return (
            <motion.div
              key={vital.id}
              className={`border-2 rounded-lg overflow-hidden ${vital.borderColor}`}
              initial={false}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(vital.id)}
                className={`w-full p-4 ${vital.bgColor} hover:opacity-80 transition-opacity flex items-center justify-between`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${vital.color}`} />
                  <h3 className="font-semibold text-gray-800">{vital.title}</h3>
                  <div className="text-sm text-gray-600">
                    Normal: {vital.normalRange.dog} (dogs) | {vital.normalRange.cat} (cats)
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white"
                  >
                    <div className="p-4 space-y-4">
                      {/* How To Measure */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          <span>How to Measure</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {vital.howTo.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* When to Be Concerned */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>When to Be Concerned</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {vital.whenToConcern.map((concern, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-yellow-500 mt-1">•</span>
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                          <Video className="w-4 h-4 text-green-500" />
                          <span>Helpful Tips</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {vital.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Footer Tips */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-2">
          <h4 className="font-semibold text-gray-800">General Tips:</h4>
          <ul className="space-y-1">
            <li>• Keep a record of normal values when your pet is healthy</li>
            <li>• Take measurements when your pet is calm and resting</li>
            <li>• If in doubt, it&apos;s always better to contact your veterinarian</li>
            <li>• Some measurements may require two people - one to hold, one to measure</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GuardianVitalSignsGuide
