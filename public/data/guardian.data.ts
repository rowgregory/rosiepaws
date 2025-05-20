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
