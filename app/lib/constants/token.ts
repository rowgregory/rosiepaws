// lib/constants/tokens.ts

// Create token costs
export const petCreateTokenCost = parseInt(process.env.PET_CREATE_TOKEN_COST!) || 200
export const painScoreCreateTokenCost = parseInt(process.env.PAIN_SCORE_CREATE_TOKEN_COST!) || 75
export const feedingCreateTokenCost = parseInt(process.env.FEEDING_CREATE_TOKEN_COST!) || 85
export const waterCreateTokenCost = parseInt(process.env.WATER_CREATE_TOKEN_COST!) || 90
export const walkCreateTokenCost = parseInt(process.env.WALK_CREATE_TOKEN_COST!) || 125
export const movementCreateTokenCost = parseInt(process.env.MOVEMENT_CREATE_TOKEN_COST!) || 225
export const appointmentCreateTokenCost = parseInt(process.env.APPOINTMENT_CREATE_TOKEN_COST!) || 150
export const medicationCreateTokenCost = parseInt(process.env.MEDICATION_CREATE_TOKEN_COST!) || 225
export const bloodSugarCreateTokenCost = parseInt(process.env.BLOOD_SUGAR_CREATE_TOKEN_COST!) || 300
export const seizureCreateTokenCost = parseInt(process.env.SEIZURE_CREATE_TOKEN_COST!) || 400

// Edit token amounts
export const petEditTokenCost = parseInt(process.env.PET_EDIT_TOKEN_COST!) || 100
export const painScoreEditTokenCost = parseInt(process.env.PAIN_SCORE_EDIT_TOKEN_COST!) || 40
export const walkEditTokenCost = parseInt(process.env.WALK_EDIT_TOKEN_COST!) || 65
export const feedingEditTokenCost = parseInt(process.env.FEEDING_EDIT_TOKEN_COST!) || 45
export const waterEditTokenCost = parseInt(process.env.WATER_EDIT_TOKEN_COST!) || 45
export const appointmentEditTokenCost = parseInt(process.env.APPOINTMENT_EDIT_TOKEN_COST!) || 75
export const medicationEditTokenCost = parseInt(process.env.MEDICATION_EDIT_TOKEN_COST!) || 115
export const bloodSugarEditTokenCost = parseInt(process.env.BLOOD_SUGAR_EDIT_TOKEN_COST!) || 150
export const seizureEditTokenCost = parseInt(process.env.SEIZURE_EDIT_TOKEN_COST!) || 200
export const movementEditTokenCost = parseInt(process.env.MOVEMENT_EDIT_TOKEN_COST!) || 115

// Delete token amounts
export const petDeleteTokenCost = parseInt(process.env.PET_DELETE_TOKEN_COST!) || 50
export const painScoreDeleteTokenCost = parseInt(process.env.PAIN_SCORE_DELETE_TOKEN_COST!) || 20
export const walkDeleteTokenCost = parseInt(process.env.WALK_DELETE_TOKEN_COST!) || 35
export const feedingDeleteTokenCost = parseInt(process.env.FEEDING_DELETE_TOKEN_COST!) || 25
export const waterDeleteTokenCost = parseInt(process.env.WATER_DELETE_TOKEN_COST!) || 25
export const appointmentDeleteTokenCost = parseInt(process.env.APPOINTMENT_DELETE_TOKEN_COST!) || 40
export const medicationDeleteTokenCost = parseInt(process.env.MEDICATION_DELETE_TOKEN_COST!) || 60
export const bloodSugarDeleteTokenCost = parseInt(process.env.BLOOD_SUGAR_DELETE_TOKEN_COST!) || 75
export const seizureDeleteTokenCost = parseInt(process.env.SEIZURE_DELETE_TOKEN_COST!) || 100
export const movementDeleteTokenCost = parseInt(process.env.MOVEMENT_DELETE_TOKEN_COST!) || 60

// Other costs
export const petUpdateTokenCost = parseInt(process.env.PET_UPDATE_TOKEN_COST!) || 5
export const galleryUploadTokenCost = parseInt(process.env.GALLERY_UPLOAD_TOKEN_COST!) || 5

// Tier prices
export const freeTierPrice = parseFloat(process.env.FREE_TIER_PRICE!) || 0
export const comfortTierPrice = parseFloat(process.env.COMFORT_TIER_PRICE!) || 11.99
export const companionTierPrice = parseFloat(process.env.COMPANION_TIER_PRICE!) || 22.99
export const legacyTierPrice = parseFloat(process.env.LEGACY_TIER_PRICE!) || 34.99

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
