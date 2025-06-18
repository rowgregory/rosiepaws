/*
  Warnings:

  - The `lastReminderDate` column on the `Medication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "timezoneOffset" INTEGER NOT NULL DEFAULT -5,
ALTER COLUMN "reminderTimes" DROP NOT NULL,
ALTER COLUMN "reminderTimes" SET DATA TYPE TEXT,
DROP COLUMN "lastReminderDate",
ADD COLUMN     "lastReminderDate" TEXT[];
