export const painAssessmentData = [
  {
    level: 'Minimal',
    color: '#A5C8EF', // Light blue
    psychological: [
      'Comfortable when resting',
      'Happy, content',
      'Not bothering wound or surgery site',
      'Interested in or curious about surroundings'
    ],
    palpation: ['Nontender to palpation of wound or surgery site, or to palpation elsewhere'],
    tension: 'Minimal',
    actionNeeded: null
  },
  {
    level: 'Mild',
    color: '#89C997', // Light green
    psychological: ['Content to slightly unsettled or restless', 'Distracted easily by surroundings'],
    palpation: [
      'Reacts to palpation of wound, surgery site, or other body part by looking around, flinching, or whimpering'
    ],
    tension: 'Mild',
    actionNeeded: null
  },
  {
    level: 'Mild to Moderate',
    color: '#FEE782', // Yellow
    psychological: [
      'Looks uncomfortable when resting',
      'May whimper or cry and may lick or rub wound or surgery site when unattended',
      'Droopy ears, worried expression (arched eye brows, darting eyes)',
      'Reluctant to respond when beckoned',
      'Not eager to interact with people or surroundings but will look around to see what is going on'
    ],
    palpation: ['Flinches, whimpers cries, or guards/pulls away'],
    tension: 'Mild to Moderate',
    actionNeeded: 'Reassess analgesic plan'
  },
  {
    level: 'Moderate',
    color: '#F79C63', // Orange
    psychological: [
      'Unsettled, crying, groaning, biting or chewing wound when unattended',
      'Guards or protects wound or surgery site by altering weight distribution (i.e., limping, shifting body position)',
      'May be unwilling to move all or part of body'
    ],
    palpation: [
      'May be subtle (shifting eyes or increased respiratory rate) if too painful to move or is stoic',
      'May be dramatic, such as a sharp cry, growl, bite or bite threat, and/or pulling away'
    ],
    tension: 'Moderate',
    actionNeeded: 'Reassess analgesic plan'
  },
  {
    level: 'Moderate to Severe',
    color: '#E0626D', // Red
    psychological: [
      'Constantly groaning or screaming when unattended',
      'May bite or chew at wound, but unlikely to move',
      'Potentially unresponsive to surroundings',
      'Difficult to distract from pain'
    ],
    palpation: [
      'Cries at non-painful palpation (may be experiencing allodynia, wind-up, or fearful that pain could be made worse)',
      'May react aggressively to palpation'
    ],
    tension: 'Moderate to Severe',
    actionNeeded: 'May be rigid to avoid painful movement\nReassess analgesic plan'
  }
]

export const feedingGuidanceData = [
  {
    category: 'Puppy (2-12 months)',
    color: '#A5C8EF', // Light blue
    frequency: '3-4 times daily',
    portions: [
      'Small breeds: 1/4 - 1/2 cup per meal',
      'Medium breeds: 1/2 - 1 cup per meal',
      'Large breeds: 1 - 1.5 cups per meal'
    ],
    tips: [
      'High-calorie puppy formula food',
      'Consistent meal times help with house training',
      'Monitor weight gain weekly'
    ],
    watchFor: ['Overeating', 'Food guarding behavior', 'Digestive upset']
  },
  {
    category: 'Adult Dog (1-7 years)',
    color: '#89C997', // Light green
    frequency: '2 times daily',
    portions: [
      'Small breeds (under 25 lbs): 1/2 - 3/4 cup per meal',
      'Medium breeds (25-60 lbs): 3/4 - 1.25 cups per meal',
      'Large breeds (60+ lbs): 1.25 - 2 cups per meal'
    ],
    tips: [
      'Maintain consistent feeding schedule',
      'Adjust portions based on activity level',
      'Fresh water always available'
    ],
    watchFor: ['Weight changes', 'Loss of appetite', 'Eating too quickly']
  },
  {
    category: 'Senior Dog (7+ years)',
    color: '#FEE782', // Yellow
    frequency: '2 times daily',
    portions: [
      'May need 20-30% fewer calories',
      'Same portion sizes but senior formula',
      'Consider smaller, more frequent meals'
    ],
    tips: ['Senior formula with joint support', 'Softer foods for dental issues', 'Monitor for changes in appetite'],
    watchFor: ['Difficulty chewing', 'Decreased appetite', 'Weight loss']
  },
  {
    category: 'Adult Cat (1-7 years)',
    color: '#F79C63', // Orange
    frequency: '2-3 times daily',
    portions: [
      'Indoor cats: 1/4 - 1/2 cup per meal',
      'Outdoor cats: 1/2 - 3/4 cup per meal',
      'Wet food: 3-5 oz per meal'
    ],
    tips: ['Cats prefer routine feeding times', 'Wet food helps with hydration', 'Leave some dry food for grazing'],
    watchFor: ['Overeating', 'Hairballs after meals', 'Vomiting']
  },
  {
    category: 'Kitten (2-12 months)',
    color: '#E0626D', // Red
    frequency: '3-4 times daily',
    portions: [
      '2-4 months: 1/4 - 1/3 cup per meal',
      '4-6 months: 1/3 - 1/2 cup per meal',
      '6-12 months: 1/2 - 2/3 cup per meal'
    ],
    tips: [
      'Kitten formula with higher calories',
      'Free feeding acceptable for young kittens',
      'Transition to adult food at 12 months'
    ],
    watchFor: ['Rapid growth changes', 'Digestive issues', 'Food competition with other pets']
  }
]

export const feedingTipsData = {
  generalTips: [
    'Measure food portions consistently',
    'Feed at the same times each day',
    'Remove uneaten food after 30 minutes',
    'Fresh water should always be available',
    "Monitor your pet's body condition regularly"
  ],
  redFlags: [
    'Sudden loss of appetite (more than 24 hours)',
    'Vomiting after every meal',
    'Difficulty swallowing or chewing',
    'Aggressive food guarding behavior',
    'Rapid weight gain or loss'
  ],
  transitionTips: [
    'Change food gradually over 7-10 days',
    'Mix 25% new food with 75% old food for days 1-3',
    'Mix 50% new food with 50% old food for days 4-6',
    'Mix 75% new food with 25% old food for days 7-9',
    'Feed 100% new food by day 10'
  ]
}
