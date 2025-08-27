'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  ChevronRight,
  Activity,
  Utensils,
  Droplets,
  Pill,
  Footprints,
  Calendar,
  Zap,
  Heart,
  Thermometer
} from 'lucide-react'

const ActivityCenter = () => {
  const [expandedCard, setExpandedCard] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const DataField = ({ name, type, required, description, example }: any) => (
    <div className="flex items-start space-x-3 py-2">
      <div className="flex-shrink-0 mt-1">
        <div className={`w-2 h-2 rounded-full ${required ? 'bg-red-500' : 'bg-green-500'}`}></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-900">{name}</span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{type}</span>
          {required && <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Required</span>}
        </div>
        <p className="text-sm text-gray-600 mb-1">{description}</p>
        {example && <p className="text-xs text-gray-500 italic">Example: {example}</p>}
      </div>
    </div>
  )

  const ActivityCard = ({ title, icon: Icon, description, fields, gradient, cardKey }: any) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
    >
      <div
        className={`p-6 bg-gradient-to-br ${gradient} cursor-pointer`}
        onClick={() => setExpandedCard(expandedCard === cardKey ? null : cardKey)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-white/80">{description}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: expandedCard === cardKey ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: expandedCard === cardKey ? 'auto' : 0,
          opacity: expandedCard === cardKey ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-6 bg-gray-50">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              Data We Collect
            </h4>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="space-y-1">
                {fields.map((field: any, index: number) => (
                  <DataField key={index} {...field} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  const painScoreFields = [
    {
      name: 'Pain Score',
      type: 'Number (1-10)',
      required: true,
      description: 'Numerical pain rating to track severity',
      example: '7 (severe pain)'
    },
    {
      name: 'Time Recorded',
      type: 'DateTime',
      required: true,
      description: 'When the pain was observed or recorded',
      example: '2024-01-15 2:30 PM'
    },
    {
      name: 'Symptoms',
      type: 'Text',
      required: false,
      description: 'Observable symptoms or behaviors indicating pain',
      example: 'Limping, whimpering, reluctant to move'
    },
    {
      name: 'Location',
      type: 'Text',
      required: false,
      description: 'Where on the body the pain is located',
      example: 'Left hip, back legs, abdomen'
    },
    {
      name: 'Triggers',
      type: 'Text',
      required: false,
      description: 'What triggered or worsened the pain',
      example: 'After walking, weather change, before medication'
    },
    {
      name: 'Relief Methods',
      type: 'Text',
      required: false,
      description: 'What provided relief from the pain',
      example: 'Heat pad, medication, rest, massage'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional observations or context',
      example: 'Seemed better after morning medication'
    }
  ]

  const feedingFields = [
    {
      name: 'Time Recorded',
      type: 'DateTime',
      required: true,
      description: 'When the feeding took place',
      example: '2024-01-15 7:00 AM'
    },
    {
      name: 'Food Type',
      type: 'Text',
      required: true,
      description: 'Type of food given (dry kibble, wet food, treats, etc.)',
      example: 'Dry kibble, wet food, training treats'
    },
    {
      name: 'Food Amount',
      type: 'Text',
      required: true,
      description: 'Amount of food provided',
      example: '1 cup, 1/2 can, 2 tablespoons'
    },
    {
      name: 'Mood Rating',
      type: 'Number (0-10)',
      required: true,
      description: "Pet's mood or enthusiasm during feeding",
      example: '8 (very enthusiastic)'
    },
    {
      name: 'Brand',
      type: 'Text',
      required: true,
      description: 'Brand name of the food',
      example: "Royal Canin, Hill's Science Diet, Blue Buffalo"
    },
    {
      name: 'Ingredients',
      type: 'Text',
      required: false,
      description: 'Key ingredients or specific dietary information',
      example: 'Chicken, rice, sweet potato, salmon oil'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional observations about feeding behavior',
      example: 'Ate very quickly, left some kibble, seemed more interested than usual'
    }
  ]

  const waterFields = [
    {
      name: 'Milliliters',
      type: 'Text',
      required: true,
      description: 'Amount of water consumed',
      example: '250ml, 1 cup, 500ml'
    },
    {
      name: 'Time Recorded',
      type: 'DateTime',
      required: true,
      description: 'When the water consumption was observed',
      example: '2024-01-15 3:45 PM'
    },
    {
      name: 'Mood Rating',
      type: 'Number (0-10)',
      required: true,
      description: "Pet's behavior or eagerness when drinking",
      example: '6 (normal drinking), 9 (very thirsty)'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional observations about drinking behavior',
      example: 'Drank very quickly, seemed extra thirsty after walk, refused water initially'
    }
  ]

  const medicationFields = [
    {
      name: 'Drug Name',
      type: 'Text',
      required: true,
      description: 'Name of the medication',
      example: 'Rimadyl, Gabapentin, Insulin'
    },
    {
      name: 'Dosage',
      type: 'Text',
      required: true,
      description: 'Amount of medication given',
      example: '25mg, 0.5ml, 1 tablet'
    },
    {
      name: 'Dosage Unit',
      type: 'Text',
      required: true,
      description: 'Unit of measurement for the dosage',
      example: 'mg, ml, tablets, drops'
    },
    {
      name: 'Frequency',
      type: 'Text',
      required: true,
      description: 'How often the medication is given',
      example: 'Twice daily, Every 8 hours, As needed'
    },
    {
      name: 'Custom Frequency',
      type: 'Text',
      required: false,
      description: 'Specific frequency instructions if not standard',
      example: 'Every other day at bedtime'
    },
    {
      name: 'Start Date',
      type: 'DateTime',
      required: true,
      description: 'When medication treatment began',
      example: '2024-01-15'
    },
    {
      name: 'End Date',
      type: 'DateTime',
      required: false,
      description: 'When medication treatment ends (if applicable)',
      example: '2024-02-15'
    },
    {
      name: 'Prescribed By',
      type: 'Text',
      required: false,
      description: 'Veterinarian who prescribed the medication',
      example: 'Dr. Smith, Animal Hospital East'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional medication notes or observations',
      example: 'Give with food, monitor for side effects'
    }
  ]

  const movementFields = [
    {
      name: 'Time Recorded',
      type: 'DateTime',
      required: true,
      description: 'When the movement activity took place',
      example: '2024-01-15 9:30 AM'
    },
    {
      name: 'Movement Type',
      type: 'Selection',
      required: true,
      description: 'Type of physical activity',
      example: 'Walk, Run, Swimming, Physical Therapy'
    },
    {
      name: 'Duration (Minutes)',
      type: 'Number',
      required: false,
      description: 'How long the activity lasted',
      example: '30, 45, 15'
    },
    {
      name: 'Distance (Meters)',
      type: 'Number',
      required: false,
      description: 'Distance covered during activity',
      example: '500, 1200, 800'
    },
    {
      name: 'Activity Level',
      type: 'Selection',
      required: true,
      description: 'Intensity of the activity',
      example: 'Low, Moderate, High, Very High'
    },
    {
      name: 'Location',
      type: 'Text',
      required: false,
      description: 'Where the activity took place',
      example: 'Backyard, Dog park, Beach, Living room'
    },
    {
      name: 'Energy Before',
      type: 'Selection',
      required: true,
      description: "Pet's energy level before activity",
      example: 'Low, Normal, High, Very High'
    },
    {
      name: 'Energy After',
      type: 'Selection',
      required: true,
      description: "Pet's energy level after activity",
      example: 'Exhausted, Tired, Normal, Still Energetic'
    },
    {
      name: 'Pain Before (1-10)',
      type: 'Number',
      required: false,
      description: 'Pain level before activity',
      example: '3, 7, 0'
    },
    {
      name: 'Pain After (1-10)',
      type: 'Number',
      required: false,
      description: 'Pain level after activity',
      example: '5, 2, 8'
    },
    {
      name: 'Equipment Used',
      type: 'Multiple Selection',
      required: false,
      description: 'Mobility aids or equipment used',
      example: 'Wheelchair, Harness, Leash'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional observations about movement',
      example: 'Limped slightly at end, seemed very enthusiastic'
    }
  ]

  const appointmentFields = [
    {
      name: 'Date',
      type: 'DateTime',
      required: true,
      description: 'Date of the appointment',
      example: '2024-02-15'
    },
    {
      name: 'Time',
      type: 'Text',
      required: true,
      description: 'Time of the appointment',
      example: '10:30 AM, 2:00 PM'
    },
    {
      name: 'Service Type',
      type: 'Selection',
      required: true,
      description: 'Type of appointment',
      example: 'Check-up, Vaccination, Surgery, Emergency'
    },
    {
      name: 'Veterinarian',
      type: 'Text',
      required: false,
      description: 'Name of the veterinarian',
      example: 'Dr. Johnson, Dr. Martinez'
    },
    {
      name: 'Description',
      type: 'Text',
      required: false,
      description: 'Purpose or details of the appointment',
      example: 'Annual wellness exam, follow-up for limping'
    },
    {
      name: 'Status',
      type: 'Selection',
      required: true,
      description: 'Current status of the appointment',
      example: 'Scheduled, Completed, Cancelled, No-show'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional appointment notes',
      example: 'Bring previous X-rays, fasting required'
    }
  ]

  const bloodSugarFields = [
    {
      name: 'Value',
      type: 'Text',
      required: true,
      description: 'Blood sugar reading',
      example: '120, 85, 200'
    },
    {
      name: 'Time Recorded',
      type: 'DateTime',
      required: true,
      description: 'When the measurement was taken',
      example: '2024-01-15 8:00 AM'
    },
    {
      name: 'Meal Relation',
      type: 'Selection',
      required: true,
      description: 'Timing relative to meals',
      example: 'Fasting, Before meal, After meal, Bedtime'
    },
    {
      name: 'Measurement Unit',
      type: 'Selection',
      required: true,
      description: 'Unit of measurement',
      example: 'mg/dL, mmol/L'
    },
    {
      name: 'Target Range',
      type: 'Text',
      required: false,
      description: 'Expected healthy range for your pet',
      example: '80-120 mg/dL, 70-140 mg/dL'
    },
    {
      name: 'Symptoms',
      type: 'Text',
      required: false,
      description: 'Associated symptoms observed',
      example: 'Lethargy, excessive thirst, increased urination'
    },
    {
      name: 'Medication Given',
      type: 'Boolean',
      required: true,
      description: 'Whether insulin or medication was administered',
      example: 'Yes, No'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional observations',
      example: 'Higher than usual, gave extra insulin as directed'
    }
  ]

  const seizureFields = [
    {
      name: 'Time Recorded',
      type: 'DateTime',
      required: true,
      description: 'When the seizure occurred',
      example: '2024-01-15 11:45 PM'
    },
    {
      name: 'Duration (Seconds)',
      type: 'Number',
      required: true,
      description: 'How long the seizure lasted',
      example: '30, 120, 45'
    },
    {
      name: 'Seizure Type',
      type: 'Selection',
      required: true,
      description: 'Classification of seizure type',
      example: 'Generalized, Focal, Partial, Unknown'
    },
    {
      name: 'Severity',
      type: 'Selection',
      required: true,
      description: 'Intensity level of the seizure',
      example: 'Mild, Moderate, Severe'
    },
    {
      name: 'Trigger Factor',
      type: 'Text',
      required: false,
      description: 'Potential causes or triggers',
      example: 'Stress, loud noise, missed medication, heat'
    },
    {
      name: 'Recovery Time (Minutes)',
      type: 'Number',
      required: false,
      description: 'Time needed to return to normal',
      example: '5, 15, 30'
    },
    {
      name: 'Video Recording',
      type: 'File',
      required: false,
      description: 'Video documentation of the seizure',
      example: 'seizure_video_01152024.mp4'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Detailed observations during and after seizure',
      example: 'Lost consciousness, paddling motions, disoriented afterward'
    }
  ]

  const vitalSignsFields = [
    {
      name: 'Time Recorded',
      type: 'DateTime',
      required: true,
      description: 'When vital signs were measured',
      example: '2024-01-15 10:00 AM'
    },
    {
      name: 'Temperature (°F)',
      type: 'Number',
      required: false,
      description: 'Body temperature in Fahrenheit',
      example: '101.5, 102.3, 100.8'
    },
    {
      name: 'Heart Rate (BPM)',
      type: 'Number',
      required: false,
      description: 'Heart beats per minute',
      example: '80, 120, 95'
    },
    {
      name: 'Respiratory Rate',
      type: 'Number',
      required: false,
      description: 'Breaths per minute',
      example: '20, 35, 15'
    },
    {
      name: 'Weight (lbs)',
      type: 'Number',
      required: false,
      description: "Pet's current weight in pounds",
      example: '45.2, 12.8, 78.5'
    },
    {
      name: 'Blood Pressure',
      type: 'Text',
      required: false,
      description: 'Systolic/diastolic blood pressure',
      example: '140/90, 120/80, 160/100'
    },
    {
      name: 'Capillary Refill Time',
      type: 'Selection',
      required: false,
      description: 'Time for gums to return to pink color',
      example: 'Normal (1-2 sec), Delayed (3+ sec), Instant'
    },
    {
      name: 'Mucous Membranes',
      type: 'Selection',
      required: false,
      description: 'Color of gums and mouth tissues',
      example: 'Pink, Pale, Blue, Yellow, Red'
    },
    {
      name: 'Hydration Status',
      type: 'Selection',
      required: false,
      description: 'Level of hydration',
      example: 'Normal, Mild dehydration, Moderate dehydration, Severe'
    },
    {
      name: 'Notes',
      type: 'Text',
      required: false,
      description: 'Additional vital sign observations',
      example: 'Slightly elevated heart rate, breathing seemed labored'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Activity className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Activity Center</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Track your pet&apos;s health with our comprehensive logging tools. Each activity helps you monitor
              patterns, identify triggers, and share valuable insights with your veterinarian.
              <span className="font-medium text-blue-600">
                {' '}
                Your data is always private and under your complete control.
              </span>
            </p>
          </motion.div>

          {/* Data Privacy Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-6 border-1 border-yellow-500"
          >
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-yellow-600">Your Data, Your Control</h3>
                <p className="text-yellow-600">
                  All health logs are stored securely in your private account. You can edit, delete, or export your data
                  anytime. We never share your pet&apos;s health information without your explicit consent.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Data Field Legend</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Required Field</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Optional Field</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Type</div>
                <span className="text-sm text-gray-700">Data Type</span>
              </div>
            </div>
          </motion.div>

          {/* Activity Cards */}
          <div className="space-y-6">
            <ActivityCard
              cardKey="pain-scoring"
              title="Pain Scoring"
              icon={Activity}
              description="Track and monitor your pet's pain levels over time"
              gradient="from-red-500 to-orange-500"
              fields={painScoreFields}
            />
            <ActivityCard
              cardKey="feeding-log"
              title="Feeding Log"
              icon={Utensils}
              description="Monitor eating habits, food preferences, and dietary patterns"
              gradient="from-green-500 to-emerald-500"
              fields={feedingFields}
            />
            <ActivityCard
              cardKey="water-intake"
              title="Water Intake"
              icon={Droplets}
              description="Monitor hydration levels and drinking patterns"
              gradient="from-blue-500 to-cyan-500"
              fields={waterFields}
            />
            <ActivityCard
              cardKey="vital-signs"
              title="Vital Signs"
              icon={Thermometer}
              description="Record comprehensive health measurements"
              gradient="from-slate-500 to-stone-500"
              fields={vitalSignsFields}
            />
            <ActivityCard
              cardKey="movement"
              title="Movement & Exercise"
              icon={Footprints}
              description="Monitor physical activity, mobility, and exercise patterns"
              gradient="from-cyan-500 to-slate-500"
              fields={movementFields}
            />
            <ActivityCard
              cardKey="appointments"
              title="Appointments"
              icon={Calendar}
              description="Schedule and track veterinary appointments"
              gradient="from-fuchsia-500 to-rose-500"
              fields={appointmentFields}
            />
            <ActivityCard
              cardKey="medication"
              title="Medication Log"
              icon={Pill}
              description="Track medication schedules, dosages, and effectiveness"
              gradient="from-indigo-500 to-purple-500"
              fields={medicationFields}
            />

            <ActivityCard
              cardKey="blood-sugar"
              title="Blood Sugar"
              icon={Heart}
              description="Monitor glucose levels for diabetic pets"
              gradient="from-red-500 to-pink-500"
              fields={bloodSugarFields}
            />

            <ActivityCard
              cardKey="seizures"
              title="Seizure Log"
              icon={Zap}
              description="Document seizure episodes with detailed observations"
              gradient="from-red-500 to-orange-500"
              fields={seizureFields}
            />
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default ActivityCenter
