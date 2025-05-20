/*
  Warnings:

  - Made the column `breed` on table `Pet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `age` on table `Pet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Pet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `Pet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "BloodSugar" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "breed" SET NOT NULL,
ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "age" SET DATA TYPE TEXT,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "weight" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "WaterIntake" ADD COLUMN     "notes" TEXT;
