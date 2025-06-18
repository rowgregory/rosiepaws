/*
  Warnings:

  - You are about to drop the column `name` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `timeGiven` on the `Medication` table. All the data in the column will be lost.
  - Added the required column `dosageUnit` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drugName` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminderTimes` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Medication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "name",
DROP COLUMN "notes",
DROP COLUMN "timeGiven",
ADD COLUMN     "customFrequency" TEXT,
ADD COLUMN     "dosageUnit" TEXT NOT NULL,
ADD COLUMN     "drugName" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "frequency" TEXT NOT NULL,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "prescribedBy" TEXT,
ADD COLUMN     "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderTimes" JSONB NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
