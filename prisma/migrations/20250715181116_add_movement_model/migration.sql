/*
  Warnings:

  - You are about to drop the `Vaccine` table. If the table is not empty, all the data it contains will be lost.

*/
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

-- DropForeignKey
ALTER TABLE "Vaccine" DROP CONSTRAINT "Vaccine_petId_fkey";

-- AlterTable
ALTER TABLE "PainScore" ADD COLUMN     "symptoms" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Walk" ADD COLUMN     "movement" TEXT DEFAULT '';

-- DropTable
DROP TABLE "Vaccine";

-- CreateTable
CREATE TABLE "Movement" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
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

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
