// Create token costs
export const petCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_PET_CREATE_TOKEN_COST!) || 200
export const painScoreCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_PAIN_SCORE_CREATE_TOKEN_COST!) || 75
export const feedingCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_FEEDING_CREATE_TOKEN_COST!) || 85
export const waterCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_WATER_CREATE_TOKEN_COST!) || 90
export const walkCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_WALK_CREATE_TOKEN_COST!) || 125
export const movementCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_MOVEMENT_CREATE_TOKEN_COST!) || 225
export const appointmentCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_APPOINTMENT_CREATE_TOKEN_COST!) || 150
export const medicationCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_MEDICATION_CREATE_TOKEN_COST!) || 225
export const bloodSugarCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_BLOOD_SUGAR_CREATE_TOKEN_COST!) || 300
export const seizureCreateTokenCost = parseInt(process.env.NEXT_PUBLIC_SEIZURE_CREATE_TOKEN_COST!) || 400

// Edit token amounts
export const petUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_PET_UPDATE_TOKEN_COST!) || 10
export const painScoreUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_PAIN_SCORE_UPDATE_TOKEN_COST!) || 40
export const walkUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_WALK_UPDATE_TOKEN_COST!) || 65
export const feedingUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_FEEDING_UPDATE_TOKEN_COST!) || 45
export const waterUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_WATER_UPDATE_TOKEN_COST!) || 45
export const appointmentUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_APPOINTMENT_UPDATE_TOKEN_COST!) || 75
export const medicationUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_MEDICATION_UPDATE_TOKEN_COST!) || 115
export const bloodSugarUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_BLOOD_SUGAR_UPDATE_TOKEN_COST!) || 150
export const seizureUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_SEIZURE_UPDATE_TOKEN_COST!) || 200
export const movementUpdateTokenCost = parseInt(process.env.NEXT_PUBLIC_MOVEMENT_UPDATE_TOKEN_COST!) || 115

// Delete token amounts
export const petDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_PET_DELETE_TOKEN_COST!) || 50
export const painScoreDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_PAIN_SCORE_DELETE_TOKEN_COST!) || 20
export const walkDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_WALK_DELETE_TOKEN_COST!) || 35
export const feedingDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_FEEDING_DELETE_TOKEN_COST!) || 25
export const waterDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_WATER_DELETE_TOKEN_COST!) || 25
export const appointmentDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_APPOINTMENT_DELETE_TOKEN_COST!) || 40
export const medicationDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_MEDICATION_DELETE_TOKEN_COST!) || 60
export const bloodSugarDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_BLOOD_SUGAR_DELETE_TOKEN_COST!) || 75
export const seizureDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_SEIZURE_DELETE_TOKEN_COST!) || 100
export const movementDeleteTokenCost = parseInt(process.env.NEXT_PUBLIC_MOVEMENT_DELETE_TOKEN_COST!) || 60

// Other costs
export const galleryUploadTokenCost = parseInt(process.env.NEXT_PUBLIC_GALLERY_UPLOAD_TOKEN_COST!) || 5

// Tier prices
export const freeTierPrice = parseFloat(process.env.NEXT_PUBLIC_FREE_TIER_PRICE!) || 0
export const comfortTierPrice = parseFloat(process.env.NEXT_PUBLIC_COMFORT_TIER_PRICE!) || 11.99
export const companionTierPrice = parseFloat(process.env.NEXT_PUBLIC_COMPANION_TIER_PRICE!) || 22.99
export const legacyTierPrice = parseFloat(process.env.NEXT_PUBLIC_LEGACY_TIER_PRICE!) || 34.99

// Tier names
export const freeTierName = 'Free'
export const comfortTierName = 'Comfort'
export const companionTierName = 'Companion'
export const legacyTierName = 'Legacy'

// Tier tokens
export const freeTierDailyTokens = parseInt(process.env.FREE_TIER_DAILY_TOKENS!) || 750
export const freeTierMonthlyTokens = 0
export const comfortTierMonthlyTokens = parseInt(process.env.COMFORT_TIER_MONTHLY_TOKENS!) || 45000
export const companionTierMonthlyTokens = parseInt(process.env.COMPANION_TIER_MONTHLY_TOKENS!) || 120000
export const legacyTierMonthlyTokens = 'Unlimited'

// Free (750 tokens daily - pain, feeding, water only)
// Basic care: 3 feedings (255) + 3 water (270) + 2 pain scores (150) = 675 tokens
// Pain focus: 2 feedings (170) + 2 water (180) + 5 pain scores (375) = 725 tokens
// Maximum: 2 feedings (170) + 2 water (180) + 6 pain scores (450) = 800 tokens (over limit)

// Comfort (45,000 monthly / ~1,500 daily)
// Daily care: 2 feedings (170) + 3 water (270) + 2 pain (150) + 1 movement (225) + 1 medication (225) + 1 walk (125) = 1,165 tokens
// Medical focus: 1 feeding (85) + 2 water (180) + 3 pain (225) + 2 medications (450) + 1 blood sugar (300) = 1,240 tokens
// Active day: 3 feedings (255) + 2 water (180) + 2 pain (150) + 2 movements (450) + 1 appointment (150) + editing (200) = 1,385 tokens

// Companion (120,000 monthly / ~4,000 daily)
// Comprehensive: 3 feedings (255) + 4 water (360) + 3 pain (225) + 3 movements (675) + 2 medications (450) + 1 blood sugar (300) + 2 walks (250) + 1 appointment (150) = 2,665 tokens
// Medical intensive: 2 feedings (170) + 3 water (270) + 4 pain (300) + 2 movements (450) + 3 medications (675) + 2 blood sugar (600) + 1 seizure (400) = 2,865 tokens
// Emergency day: 2 feedings (170) + 2 water (180) + 6 pain (450) + 1 movement (225) + 4 medications (900) + 3 blood sugar (900) + 2 seizures (800) + editing (300) = 3,925 tokens

// Premium (Unlimited)
// No limits: Track everything, edit freely, handle medical emergencies without token anxiety
// Crisis management: Unlimited seizure tracking, hourly pain monitoring, extensive medication logging
// Multiple pets: Full comprehensive care for multiple disabled/elderly pets simultaneously
