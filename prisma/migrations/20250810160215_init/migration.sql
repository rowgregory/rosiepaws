-- CreateEnum
CREATE TYPE "TokenTransactionType" AS ENUM ('SIGNUP_BONUS', 'PURCHASE', 'USAGE', 'REFUND', 'BONUS', 'ADMIN_ADJUSTMENT', 'PET_CREATION', 'PET_UPDATE', 'PET_DELETE', 'WALK_CREATION', 'WALK_UPDATE', 'WALK_DELETE', 'VITAL_SIGNS_CREATION', 'VITAL_SIGNS_UPDATE', 'VITAL_SIGNS_DELETE', 'PAIN_SCORE_CREATION', 'PAIN_SCORE_UPDATE', 'PAIN_SCORE_DELETE', 'FEEDING_CREATION', 'FEEDING_UPDATE', 'FEEDING_DELETE', 'APPOINTMENT_CREATION', 'APPOINTMENT_UPDATE', 'APPOINTMENT_DELETE', 'WATER_CREATION', 'WATER_UPDATE', 'WATER_DELETE', 'MEDICATION_CREATION', 'MEDICATION_UPDATE', 'MEDICATION_DELETE', 'BLOOD_SUGAR_CREATION', 'BLOOD_SUGAR_UPDATE', 'BLOOD_SUGAR_DELETE', 'SEIZURE_TRACKING_CREATION', 'SEIZURE_TRACKING_UPDATE', 'SEIZURE_TRACKING_DELETE', 'MOVEMENT_CREATION', 'MOVEMENT_UPDATE', 'MOVEMENT_DELETE', 'GALLERY_ITEM_CREATION', 'GALLERY_ITEM_DELETE');

-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('DOG', 'CAT');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('POSTER', 'EBOOK', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "GalleryItemType" AS ENUM ('VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "MediaColor" AS ENUM ('BLUE', 'PURPLE', 'GREEN', 'ORANGE', 'RED', 'INDIGO', 'PINK', 'YELLOW', 'GRAY');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('CHECKUP', 'VACCINATION', 'GROOMING', 'DENTAL', 'SURGERY', 'EMERGENCY', 'CONSULTATION');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('WALK', 'RUN', 'SWIM', 'PHYSICAL_THERAPY', 'INDOOR_ACTIVITY', 'YARD_TIME', 'WHEELCHAIR_MOBILITY', 'ASSISTED_WALKING', 'STRETCHING', 'EXERCISE');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('EXHAUSTED', 'TIRED', 'NORMAL', 'ENERGETIC', 'HYPERACTIVE');

-- CreateEnum
CREATE TYPE "GaitQuality" AS ENUM ('NORMAL', 'SLIGHTLY_OFF', 'NOTICEABLE_LIMP', 'SEVERE_LIMP', 'UNABLE_TO_WALK');

-- CreateEnum
CREATE TYPE "MobilityLevel" AS ENUM ('FULL_MOBILITY', 'SLIGHT_LIMITATION', 'MODERATE_LIMITATION', 'SEVERE_LIMITATION', 'IMMOBILE');

-- CreateEnum
CREATE TYPE "AssistanceType" AS ENUM ('NONE', 'VERBAL_ENCOURAGEMENT', 'LEASH_SUPPORT', 'HARNESS_LIFT', 'WHEELCHAIR', 'CARRIED', 'FULL_ASSISTANCE');

-- CreateEnum
CREATE TYPE "PantingLevel" AS ENUM ('NONE', 'LIGHT', 'MODERATE', 'HEAVY', 'EXCESSIVE');

-- CreateEnum
CREATE TYPE "MealRelation" AS ENUM ('FASTING', 'BEFORE_MEAL', 'AFTER_MEAL', 'BEDTIME', 'RANDOM');

-- CreateEnum
CREATE TYPE "MeasurementUnit" AS ENUM ('MG_DL', 'MMOL_L');

-- CreateEnum
CREATE TYPE "SeizureType" AS ENUM ('GENERALIZED', 'FOCAL', 'ABSENCE', 'MYOCLONIC', 'TONIC_CLONIC', 'ATONIC', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SeizureSeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CapillaryRefillTime" AS ENUM ('LESS_THAN_ONE_SECOND', 'ONE_TO_TWO_SECONDS', 'TWO_TO_THREE_SECONDS', 'MORE_THAN_THREE_SECONDS');

-- CreateEnum
CREATE TYPE "MucousMembraneColor" AS ENUM ('PINK_AND_MOIST', 'PALE', 'WHITE', 'BLUE_CYANOTIC', 'YELLOW_ICTERIC', 'RED_INJECTED');

-- CreateEnum
CREATE TYPE "HydrationStatus" AS ENUM ('NORMAL', 'MILD_DEHYDRATION', 'MODERATE_DEHYDRATION', 'SEVERE_DEHYDRATION');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "StripeSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "plan" TEXT NOT NULL DEFAULT 'COMFORT',
    "planPrice" INTEGER NOT NULL DEFAULT 0,
    "tokensIncluded" INTEGER NOT NULL DEFAULT 0,
    "trialEndsAt" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL,
    "canceledAt" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentMethodBrand" TEXT,
    "paymentMethodLast4" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL DEFAULT 'Free',
    "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isFreeUser" BOOLEAN NOT NULL DEFAULT true,
    "isComfortUser" BOOLEAN NOT NULL DEFAULT false,
    "isLegacyUser" BOOLEAN NOT NULL DEFAULT false,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "stripeCustomerId" VARCHAR(255),
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 750,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "lastTokenReset" TIMESTAMP(3),
    "vetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TokenTransactionType" NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PetType" NOT NULL,
    "breed" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "spayedNeutered" TEXT NOT NULL,
    "microchipId" TEXT,
    "allergies" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "lastVisit" TIMESTAMP(3),
    "nextVisit" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "notes" TEXT,
    "fileName" VARCHAR(255) NOT NULL DEFAULT '',
    "filePath" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PainScore" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "timeRecorded" TIMESTAMP(3) NOT NULL,
    "symptoms" TEXT DEFAULT '',
    "location" TEXT,
    "triggers" TEXT,
    "relief" TEXT,
    "notes" TEXT,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PainScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feeding" (
    "id" TEXT NOT NULL,
    "timeRecorded" TIMESTAMP(3) NOT NULL,
    "foodType" TEXT NOT NULL,
    "foodAmount" TEXT NOT NULL,
    "moodRating" INTEGER NOT NULL DEFAULT 0,
    "brand" TEXT NOT NULL,
    "ingredients" TEXT,
    "notes" TEXT,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Water" (
    "id" TEXT NOT NULL,
    "milliliters" TEXT NOT NULL,
    "timeRecorded" TIMESTAMP(3) NOT NULL,
    "moodRating" INTEGER NOT NULL,
    "notes" TEXT,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Water_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "dosageUnit" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "customFrequency" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "reminderTimes" TEXT[],
    "lastReminderDate" TEXT,
    "sentRemindersToday" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "prescribedBy" TEXT,
    "timezoneOffset" INTEGER DEFAULT -5,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeRecorded" TIMESTAMP(3) NOT NULL,
    "movementType" "MovementType" NOT NULL,
    "durationMinutes" INTEGER,
    "distanceMeters" DOUBLE PRECISION,
    "activityLevel" "ActivityLevel" NOT NULL,
    "location" TEXT,
    "indoor" BOOLEAN NOT NULL DEFAULT false,
    "weather" TEXT,
    "temperature" DOUBLE PRECISION,
    "energyBefore" "EnergyLevel" NOT NULL,
    "energyAfter" "EnergyLevel" NOT NULL,
    "painBefore" INTEGER,
    "painAfter" INTEGER,
    "gaitQuality" "GaitQuality",
    "mobility" "MobilityLevel" NOT NULL,
    "assistance" "AssistanceType",
    "wheelchair" BOOLEAN NOT NULL DEFAULT false,
    "harness" BOOLEAN NOT NULL DEFAULT false,
    "leash" BOOLEAN NOT NULL DEFAULT false,
    "enthusiasm" INTEGER,
    "reluctance" BOOLEAN NOT NULL DEFAULT false,
    "limping" BOOLEAN NOT NULL DEFAULT false,
    "panting" "PantingLevel",
    "restBreaks" INTEGER,
    "recoveryTime" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "reminderTime" TEXT,
    "reminderEnabled" BOOLEAN,
    "serviceType" "AppointmentType" NOT NULL,
    "description" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "veterinarian" TEXT,
    "notes" TEXT,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodSugar" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "notes" TEXT,
    "timeRecorded" TIMESTAMP(3) NOT NULL,
    "mealRelation" "MealRelation" NOT NULL DEFAULT 'FASTING',
    "measurementUnit" "MeasurementUnit" NOT NULL DEFAULT 'MG_DL',
    "targetRange" TEXT,
    "symptoms" TEXT,
    "medicationGiven" BOOLEAN NOT NULL DEFAULT false,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodSugar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seizure" (
    "id" TEXT NOT NULL,
    "timeRecorded" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "notes" TEXT,
    "videoUrl" TEXT,
    "videoFilename" TEXT,
    "seizureType" "SeizureType" NOT NULL DEFAULT 'GENERALIZED',
    "severity" "SeizureSeverity" NOT NULL DEFAULT 'MILD',
    "triggerFactor" TEXT,
    "recoveryTime" INTEGER,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seizure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "agreedToPrivacyStatement" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "GalleryItemType" NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "thumbnail" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deviceInfo" TEXT NOT NULL,
    "attachments" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "attachments" JSONB,
    "ticketId" TEXT NOT NULL,
    "authorEmail" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "MediaType" NOT NULL,
    "format" VARCHAR(10) NOT NULL,
    "size" VARCHAR(20) NOT NULL,
    "sizeBytes" BIGINT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT,
    "color" "MediaColor" NOT NULL DEFAULT 'BLUE',
    "fileName" VARCHAR(255) NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalSigns" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "heartRate" INTEGER,
    "respiratoryRate" INTEGER,
    "weight" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "capillaryRefillTime" "CapillaryRefillTime",
    "mucousMembranes" "MucousMembraneColor",
    "hydrationStatus" "HydrationStatus",
    "notes" TEXT,
    "timeRecorded" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VitalSigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vet" (
    "id" TEXT NOT NULL,
    "vetName" TEXT NOT NULL,
    "clinicName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Vet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscription_userId_key" ON "StripeSubscription"("userId");

-- CreateIndex
CREATE INDEX "StripeSubscription_userId_idx" ON "StripeSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_vetId_key" ON "User"("vetId");

-- CreateIndex
CREATE INDEX "TokenTransaction_userId_createdAt_idx" ON "TokenTransaction"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- CreateIndex
CREATE INDEX "GalleryItem_userId_createdAt_idx" ON "GalleryItem"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "GalleryItem_petId_createdAt_idx" ON "GalleryItem"("petId", "createdAt");

-- CreateIndex
CREATE INDEX "GalleryItem_type_idx" ON "GalleryItem"("type");

-- CreateIndex
CREATE INDEX "Ticket_userId_createdAt_idx" ON "Ticket"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Ticket_priority_idx" ON "Ticket"("priority");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "TicketMessage_ticketId_createdAt_idx" ON "TicketMessage"("ticketId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "Media"("type");

-- CreateIndex
CREATE INDEX "Media_uploadDate_idx" ON "Media"("uploadDate");

-- CreateIndex
CREATE INDEX "Media_isActive_idx" ON "Media"("isActive");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeSubscription" ADD CONSTRAINT "StripeSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Vet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainScore" ADD CONSTRAINT "PainScore_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeding" ADD CONSTRAINT "Feeding_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Water" ADD CONSTRAINT "Water_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodSugar" ADD CONSTRAINT "BloodSugar_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seizure" ADD CONSTRAINT "Seizure_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryItem" ADD CONSTRAINT "GalleryItem_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryItem" ADD CONSTRAINT "GalleryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
