-- CreateEnum
CREATE TYPE "MealRelation" AS ENUM ('FASTING', 'BEFORE_MEAL', 'AFTER_MEAL', 'BEDTIME', 'RANDOM');

-- CreateEnum
CREATE TYPE "MeasurementUnit" AS ENUM ('MG_DL', 'MMOL_L');

-- AlterTable
ALTER TABLE "BloodSugar" ADD COLUMN     "mealRelation" "MealRelation" NOT NULL DEFAULT 'FASTING',
ADD COLUMN     "measurementUnit" "MeasurementUnit" NOT NULL DEFAULT 'MG_DL',
ADD COLUMN     "medicationGiven" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "symptoms" TEXT,
ADD COLUMN     "targetRange" TEXT;
