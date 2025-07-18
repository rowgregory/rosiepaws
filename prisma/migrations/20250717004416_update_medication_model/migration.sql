-- AlterTable
ALTER TABLE "Medication" ALTER COLUMN "sentRemindersToday" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "timezoneOffset" DROP NOT NULL;
