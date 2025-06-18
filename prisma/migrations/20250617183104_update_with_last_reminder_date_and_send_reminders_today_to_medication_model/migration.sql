-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "lastReminderDate" TEXT,
ADD COLUMN     "sentRemindersToday" TEXT[];
