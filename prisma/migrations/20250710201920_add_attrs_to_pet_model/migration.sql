/*
  Warnings:

  - Added the required column `allergies` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactName` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactPhone` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `microchipId` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spayedNeutered` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "allergies" TEXT NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT NOT NULL,
ADD COLUMN     "emergencyContactPhone" TEXT NOT NULL,
ADD COLUMN     "microchipId" TEXT NOT NULL,
ADD COLUMN     "spayedNeutered" TEXT NOT NULL;
