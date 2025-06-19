import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Pill, Scale, AlertTriangle, Lightbulb, Shield } from 'lucide-react'

const GuardianMedicationGuildlines = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('guidelines')

  const medicationGuidanceData = [
    {
      category: 'Pain Management',
      frequency: 'NSAIDs, Opioids, Gabapentin',
      color: '#EF4444',
      portions: [
        'NSAIDs: Give with food to prevent stomach upset',
        'Start with lowest effective dose',
        'Monitor for limping improvement within 3-7 days',
        'Watch for decreased appetite or vomiting',
        'Never combine multiple NSAIDs',
        'Never give if your pet is receiving a steroid medication'
      ],
      tips: [
        'Keep a pain diary to track effectiveness',
        'Note activity levels before and after medication',
        'Cold therapy can complement pain medications',
        'Maintain consistent dosing schedule',
        'Consider weight management for joint pain'
      ],
      watchFor: [
        'Loss of appetite or vomiting',
        'Black, tarry stools (GI bleeding)',
        'Increased lethargy or weakness',
        'Excessive panting or restlessness',
        'Signs of liver toxicity (yellowing of gums/eyes)'
      ]
    },
    {
      category: 'Steroids',
      frequency: 'Prednisone, Prednisolone, Methylprednisone',
      color: '#F59E0B',
      portions: [
        'Do not give with any NSAIDs',
        'May cause increased thirst and increased urination',
        'May me more susceptible to infection, may have increased panting.'
      ],
      tips: [
        'Give with food to reduce stomach upset',
        'Administer at the same time each day for consistency',
        'Never stop steroids abruptly - always taper the dose gradually',
        "Monitor your pet's weight as steroids can cause weight gain",
        'Keep a log of side effects to discuss with your veterinarian'
      ],
      watchFor: [
        'Excessive panting or difficulty breathing',
        'Vomiting or diarrhea, especially if blood is present',
        'Signs of infection (fever, lethargy, loss of appetite)',
        'Increased aggression or behavioral changes',
        'Swelling in the face, legs, or abdomen'
      ]
    },
    {
      category: 'Antibiotics',
      frequency: 'Amoxicillin, Cephalexin, Metronidazole',
      color: '#3B82F6',
      portions: [
        'Complete entire course even if symptoms improve',
        'Give at evenly spaced intervals',
        'Most effective when given with small amount of food',
        'Store in cool, dry place (refrigerate if specified)',
        'Never share antibiotics between pets'
      ],
      tips: [
        'Set phone reminders for dosing times',
        'Use pill pockets or treats for easy administration',
        'Monitor for improvement within 48-72 hours',
        'Take photos of affected areas to track healing',
        'Probiotics may help prevent digestive upset'
      ],
      watchFor: [
        'Diarrhea or loose stools',
        'Vomiting or loss of appetite',
        'Allergic reactions (facial swelling, hives)',
        'No improvement after 3-4 days',
        'Secondary infections (yeast, fungal)'
      ]
    },
    {
      category: 'Heart Medications',
      frequency: 'Enalapril, Furosemide, Pimobendan',
      color: '#DC2626',
      portions: [
        'Give at same times daily for consistent blood levels',
        'Pimobendan should be given 1 hour before meals',
        'Monitor water intake and urination patterns',
        'Weigh pet weekly to track fluid retention',
        'Keep rescue medications easily accessible'
      ],
      tips: [
        'Create a medication schedule chart',
        'Monitor breathing rate at rest (normal: 10-30 breaths/min)',
        'Watch for exercise intolerance',
        'Keep emergency vet contact readily available',
        'Learn to check pulse and heart rate'
      ],
      watchFor: [
        'Increased coughing, especially at night',
        'Difficulty breathing or rapid breathing',
        'Loss of appetite or weight loss',
        'Fainting or collapse episodes',
        'Swollen abdomen or limbs'
      ]
    },
    {
      category: 'Seizure Medications',
      frequency: 'Phenobarbital, Keppra, Zonisamide',
      color: '#7C3AED',
      portions: [
        'Never miss doses - can trigger breakthrough seizures',
        'Give at exact same times daily',
        'Phenobarbital requires regular blood monitoring',
        'Taper gradually if discontinuing (never stop abruptly)',
        'Keep seizure log with frequency and duration'
      ],
      tips: [
        'Use multiple alarms and backup reminders',
        'Keep emergency rescue medications on hand',
        'Create seizure action plan with your vet',
        'Video record seizures to show veterinarian',
        'Ensure all family members know seizure protocol'
      ],
      watchFor: [
        'Increased seizure frequency or severity',
        'Excessive sedation or stumbling',
        'Loss of appetite lasting more than 24 hours',
        'Behavior changes or aggression',
        'Signs of liver problems (yellowing, vomiting)'
      ]
    },
    {
      category: 'Thyroid Medications',
      frequency: 'Levothyroxine, Methimazole',
      color: '#059669',
      portions: [
        'Give thyroid hormone on empty stomach (1 hour before food)',
        'Methimazole can be given with food if stomach upset occurs',
        'Maintain consistent timing for optimal absorption',
        'Regular blood tests needed to monitor levels',
        'Some medications can interfere with absorption'
      ],
      tips: [
        'Schedule blood work 4-6 hours after morning dose',
        'Monitor energy levels and weight changes',
        'Keep medication away from calcium and iron supplements',
        'Use same brand consistently when possible',
        'Track symptoms in a daily log'
      ],
      watchFor: [
        'Sudden weight gain or loss',
        'Changes in appetite or thirst',
        'Lethargy or hyperactivity',
        'Hair loss or coat changes',
        'Vomiting or facial scratching (methimazole)'
      ]
    }
  ]

  const medicationTipsData = {
    generalTips: [
      'Always read medication labels carefully before administering',
      'Store medications in original containers with labels intact',
      'Keep human medications separate from pet medications',
      'Use a pill organizer for complex medication schedules',
      'Take photos of medications and dosing instructions',
      'Keep emergency vet contact information easily accessible',
      'Never give expired medications to your pet',
      'Measure liquid medications with provided syringes or droppers'
    ],
    redFlags: [
      'Difficulty breathing or rapid breathing',
      'Collapse, fainting, or severe weakness',
      'Vomiting blood or black, tarry stools',
      'Severe allergic reactions (facial swelling, hives)',
      'Sudden onset of seizures or increased seizure activity',
      'Complete loss of appetite for more than 24 hours',
      'Yellowing of gums, eyes, or skin',
      'Excessive drooling, pawing at mouth, or difficulty swallowing'
    ],
    administrationTips: [
      'Hide pills in small amounts of favorite treats or pill pockets',
      'Use liquid medications mixed with a small amount of food',
      'Gently hold muzzle and tilt head back for direct pill administration',
      'Follow pills with water or treats to ensure swallowing',
      'Reward immediately after giving medication',
      'Crush pills only if approved by veterinarian',
      'Apply topical medications to clean, dry skin',
      'Wear gloves when handling chemotherapy or hormone medications'
    ]
  }

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Medication Guidelines</h3>
        <p className="text-sm text-gray-600">Safe medication management</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'guidelines', label: 'Guidelines', icon: Pill },
          { id: 'tips', label: 'Tips', icon: Lightbulb }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'guidelines' && (
          <div className="space-y-3">
            {medicationGuidanceData.map((guide, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                style={{ borderLeftColor: guide.color, borderLeftWidth: '4px' }}
              >
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{guide.category}</h4>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <Pill size={12} className="mr-1" />
                        {guide.frequency}
                      </p>
                    </div>
                    {expandedCategory === index ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedCategory === index && (
                  <div className="px-3 pb-3 space-y-3">
                    {/* Administration Guidelines */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <Scale size={12} className="mr-1" />
                        Administration Guidelines
                      </h5>
                      <ul className="space-y-1">
                        {guide.portions.map((portion, idx) => (
                          <li key={idx} className="text-xs text-gray-600 pl-3 relative">
                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-gray-400 rounded-full"></span>
                            {portion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <Lightbulb size={12} className="mr-1" />
                        Helpful Tips
                      </h5>
                      <ul className="space-y-1">
                        {guide.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-gray-600 pl-3 relative">
                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-green-400 rounded-full"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Watch For */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <AlertTriangle size={12} className="mr-1" />
                        Watch For
                      </h5>
                      <ul className="space-y-1">
                        {guide.watchFor.map((warning, idx) => (
                          <li key={idx} className="text-xs text-gray-600 pl-3 relative">
                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-red-400 rounded-full"></span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            {/* General Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 text-sm mb-2 flex items-center">
                <Lightbulb size={14} className="mr-2" />
                General Medication Safety
              </h4>
              <ul className="space-y-1">
                {medicationTipsData.generalTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-blue-800 pl-3 relative">
                    <span className="absolute left-0 top-1.5 w-1 h-1 bg-blue-500 rounded-full"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-medium text-red-900 text-sm mb-2 flex items-center">
                <AlertTriangle size={14} className="mr-2" />
                Emergency Warning Signs
              </h4>
              <ul className="space-y-1">
                {medicationTipsData.redFlags.map((flag, idx) => (
                  <li key={idx} className="text-xs text-red-800 pl-3 relative">
                    <span className="absolute left-0 top-1.5 w-1 h-1 bg-red-500 rounded-full"></span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            {/* Administration Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-medium text-green-900 text-sm mb-2 flex items-center">
                <Shield size={14} className="mr-2" />
                Administration Techniques
              </h4>
              <ul className="space-y-1">
                {medicationTipsData.administrationTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-green-800 pl-3 relative">
                    <span className="absolute left-0 top-1.5 w-1 h-1 bg-green-500 rounded-full"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuardianMedicationGuildlines
