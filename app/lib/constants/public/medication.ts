export const COMMON_MEDICATIONS = [
  'Acepromazine',
  'Adequan',
  'Amoxicillin',
  'Amoxicillin/Clavulanate',
  'Apoquel',
  'Atopica',
  'Azithromycin',
  'Baytril',
  'Benadryl',
  'Bravecto',
  'Carprofen',
  'Cephalexin',
  'Cerenia',
  'Chlorpheniramine',
  'Ciprofloxacin',
  'Clindamycin',
  'Cosequin',
  'Cytopoint',
  'Dasuquin',
  'Denamarin',
  'Deramaxx',
  'Dexamethasone',
  'Doxycycline',
  'Dramamine',
  'Enalapril',
  'Enrofloxacin',
  'Famotidine',
  'Firocoxib',
  'Fluconazole',
  'Frontline',
  'Furosemide',
  'Gabapentin',
  'Heartgard',
  'Hydroxyzine',
  'Imodium',
  'Interceptor',
  'Itraconazole',
  'Ketoconazole',
  'Loperamide',
  'Maropitant',
  'Meloxicam',
  'Metoclopramide',
  'Metronidazole',
  'Minocycline',
  'Nexgard',
  'Omeprazole',
  'Penicillin',
  'Pepcid',
  'Phenobarbital',
  'Pimobendan',
  'Prednisolone',
  'Prednisone',
  'Previcox',
  'Proin',
  'Pyrantel',
  'Rimadyl',
  'Robaxin',
  'Sentinel',
  'Simparica',
  'Soloxine',
  'Sucralfate',
  'Sulfamethoxazole/Trimethoprim',
  'Temaril-P',
  'Tetracycline',
  'Theophylline',
  'Thyro-Tabs',
  'Tramadol',
  'Trazodone',
  'Trilostane',
  'Tylosin',
  'Vanectyl-P',
  'Vetmedin',
  'Vetoryl',
  'Zeniquin',
  'Zonisamide',
  'Zyrtec'
]

export const DOSAGE_UNITS = ['mg', 'ml', 'tablets', 'capsules', 'drops', 'pumps', 'units']

export const FREQUENCIES = [
  { value: 'once_daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily (BID)' },
  { value: 'three_times_daily', label: 'Three times daily (TID)' },
  { value: 'four_times_daily', label: 'Four times daily (QID)' },
  { value: 'five_times_daily', label: 'Five times daily' },
  { value: 'six_times_daily', label: 'Six times daily' },
  { value: 'every_2_hours', label: 'Every 2 hours' },
  { value: 'every_3_hours', label: 'Every 3 hours' },
  { value: 'every_4_hours', label: 'Every 4 hours' },
  { value: 'every_6_hours', label: 'Every 6 hours' },
  { value: 'every_8_hours', label: 'Every 8 hours' },
  { value: 'every_12_hours', label: 'Every 12 hours' },
  { value: 'every_other_day', label: 'Every other day' },
  { value: 'every_3_days', label: 'Every 3 days' },
  { value: 'twice_weekly', label: 'Twice weekly' },
  { value: 'three_times_weekly', label: 'Three times weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'every_2_weeks', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'morning_only', label: 'Morning only' },
  { value: 'evening_only', label: 'Evening only' },
  { value: 'bedtime', label: 'At bedtime' },
  { value: 'with_meals', label: 'With meals' },
  { value: 'before_meals', label: 'Before meals' },
  { value: 'after_meals', label: 'After meals' },
  { value: 'morning_and_evening', label: 'Morning and evening' },
  { value: 'as_needed', label: 'As needed (PRN)' },
  { value: 'as_needed_pain', label: 'As needed for pain' },
  { value: 'as_needed_nausea', label: 'As needed for nausea' },
  { value: 'as_needed_anxiety', label: 'As needed for anxiety' },
  { value: 'as_needed_sleep', label: 'As needed for sleep' }
]

export const DEFAULT_REMINDER_TIMES = ['08:00', '12:00', '18:00', '22:00']

export const TIME_ZONE_OPTIONS = [
  { value: -11, label: 'UTC-11 (Hawaii)' },
  { value: -10, label: 'UTC-10 (Alaska)' },
  { value: -9, label: 'UTC-9 (Alaska)' },
  { value: -8, label: 'UTC-8 (PST - Los Angeles)' },
  { value: -7, label: 'UTC-7 (MST - Denver)' },
  { value: -6, label: 'UTC-6 (CST - Chicago)' },
  { value: -5, label: 'UTC-5 (EST - New York)' }
]

export const medicationGuidanceData = [
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

export const medicationTipsData = {
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
