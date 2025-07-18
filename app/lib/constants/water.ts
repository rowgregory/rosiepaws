export const pets = [
  { id: '1', name: 'Buddy', type: 'DOG' },
  { id: '2', name: 'Whiskers', type: 'CAT' },
  { id: '3', name: 'Luna', type: 'DOG' }
]

export const INTAKE_TYPES = [{ id: 'milliliters', name: 'Exact Amount', icon: '📏', description: 'Record in mL' }]

export const waterGuidanceData = [
  {
    category: 'Dogs',
    frequency: '50ml per kg body weight daily',
    color: '#3B82F6',
    portions: [
      'Small dogs (2-10kg): 100-500ml daily',
      'Medium dogs (10-25kg): 500-1,250ml daily',
      'Large dogs (25-45kg): 1,250-2,250ml daily',
      'Giant dogs (45kg+): 2,250ml+ daily'
    ],
    tips: [
      'Provide fresh water at all times',
      'Clean water bowls daily',
      'Monitor intake during hot weather',
      'Some dogs prefer moving water',
      'Multiple water stations for large homes'
    ],
    watchFor: [
      'Sudden increase in drinking (could indicate diabetes)',
      'Drinking very little water for 24+ hours',
      'Excessive panting with little water intake',
      'Signs of dehydration (dry gums, lethargy)',
      'Vomiting after drinking water'
    ]
  },
  {
    category: 'Cats',
    frequency: '45ml per kg body weight daily',
    color: '#8B5CF6',
    portions: [
      'Kitten (0.5-2kg): 25-90ml daily',
      'Small adult (2-4kg): 90-180ml daily',
      'Medium adult (4-6kg): 180-270ml daily',
      'Large adult (6kg+): 270ml+ daily'
    ],
    tips: [
      'Cats often prefer fresh, moving water',
      'Consider a water fountain',
      'Place multiple water bowls around the house',
      'Some cats prefer wide, shallow bowls',
      'Wet food increases overall water intake'
    ],
    watchFor: [
      'Drinking significantly more than usual',
      'Not drinking for 24+ hours',
      'Urinating outside the litter box',
      'Signs of kidney issues (lethargy, poor appetite)',
      'Excessive meowing while at water bowl'
    ]
  },
  {
    category: 'Puppies & Kittens',
    frequency: 'More frequent, smaller amounts',
    color: '#10B981',
    portions: [
      '8-12 weeks: 60-80ml per kg daily',
      '3-6 months: 50-70ml per kg daily',
      'Monitor closely during weaning',
      'Offer water with each meal'
    ],
    tips: [
      'Start offering water at 3-4 weeks old',
      'Use shallow bowls to prevent drowning',
      'Clean water bowls multiple times daily',
      'Monitor for signs of overdrinking',
      'Gradually transition from milk to water'
    ],
    watchFor: [
      'Difficulty reaching water bowl',
      'Playing in water instead of drinking',
      'Diarrhea from drinking too much too fast',
      'Not showing interest in water after weaning',
      'Wobbly walking after drinking'
    ]
  },
  {
    category: 'Senior Pets',
    frequency: 'Monitor closely, may need encouragement',
    color: '#F59E0B',
    portions: [
      'Same baseline as adult pets',
      'May need softer/easier access',
      'Consider elevated water bowls',
      'Monitor for decreased mobility affecting access'
    ],
    tips: [
      'Encourage drinking with flavored water',
      'Use elevated or easily accessible bowls',
      'Monitor for medication effects on thirst',
      'Consider wet food to increase intake',
      'Multiple water stations for arthritic pets'
    ],
    watchFor: [
      'Difficulty bending down to drink',
      'Forgetting to drink water',
      'Kidney disease symptoms',
      'Medication side effects affecting thirst',
      'Cognitive changes affecting drinking habits'
    ]
  }
]

export const waterTipsData = {
  generalTips: [
    'Change water daily, even if bowl looks clean',
    'Wash water bowls with soap and hot water regularly',
    'Test water temperature - room temperature is best',
    'Consider filtered water if your tap water has strong odors',
    'Place water bowls away from food to keep them cleaner',
    'Use stainless steel or ceramic bowls when possible',
    'Monitor water intake by measuring daily',
    'Keep backup water sources during power outages'
  ],
  redFlags: [
    'No urination for 12+ hours',
    'Drinking entire bowl in one sitting repeatedly',
    'Refusing water for more than 24 hours',
    'Vomiting immediately after drinking',
    'Excessive drooling while drinking',
    'Difficulty swallowing or painful drinking',
    'Sudden dramatic changes in drinking habits',
    'Signs of dehydration (dry gums, sunken eyes)'
  ],
  hydrationTips: [
    'Add ice cubes on hot days for enrichment',
    'Flavor water with low-sodium bone broth',
    'Try different bowl materials and shapes',
    'Keep water bowls in quiet, accessible areas',
    "Use wide bowls so whiskers don't touch sides",
    'Consider automatic water dispensers for consistency',
    'Monitor during travel and provide extra water',
    'Watch for seasonal changes in drinking patterns'
  ]
}
