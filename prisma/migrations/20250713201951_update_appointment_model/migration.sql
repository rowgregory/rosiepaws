/*
  Warnings:

  - You are about to drop the column `location` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `serviceType` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('CHECKUP', 'VACCINATION', 'GROOMING', 'DENTAL', 'SURGERY', 'EMERGENCY', 'CONSULTATION');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "location",
DROP COLUMN "reason",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "serviceType" "AppointmentType" NOT NULL,
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "veterinarian" TEXT;
