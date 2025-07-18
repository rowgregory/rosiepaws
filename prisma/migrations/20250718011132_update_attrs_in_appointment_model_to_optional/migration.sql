-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "reminderEnabled" DROP NOT NULL,
ALTER COLUMN "reminderTime" DROP NOT NULL;
