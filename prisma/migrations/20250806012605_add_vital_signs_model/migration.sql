/*
  Warnings:

  - You are about to drop the `Walk` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CapillaryRefillTime" AS ENUM ('LESS_THAN_ONE_SECOND', 'ONE_TO_TWO_SECONDS', 'TWO_TO_THREE_SECONDS', 'MORE_THAN_THREE_SECONDS');

-- CreateEnum
CREATE TYPE "MucousMembraneColor" AS ENUM ('PINK_AND_MOIST', 'PALE', 'WHITE', 'BLUE_CYANOTIC', 'YELLOW_ICTERIC', 'RED_INJECTED');

-- CreateEnum
CREATE TYPE "HydrationStatus" AS ENUM ('NORMAL', 'MILD_DEHYDRATION', 'MODERATE_DEHYDRATION', 'SEVERE_DEHYDRATION');

-- DropForeignKey
ALTER TABLE "Walk" DROP CONSTRAINT "Walk_petId_fkey";

-- DropTable
DROP TABLE "Walk";

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

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
