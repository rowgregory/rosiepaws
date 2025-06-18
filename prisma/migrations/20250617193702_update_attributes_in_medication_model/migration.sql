/*
  Warnings:

  - The `reminderTimes` column on the `Medication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "reminderTimes",
ADD COLUMN     "reminderTimes" TEXT[],
ALTER COLUMN "lastReminderDate" DROP NOT NULL,
ALTER COLUMN "lastReminderDate" SET DATA TYPE TEXT;
