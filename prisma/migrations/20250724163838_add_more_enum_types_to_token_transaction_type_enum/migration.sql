-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TokenTransactionType" ADD VALUE 'PET_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'PET_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'WALK_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'WALK_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'PAIN_SCORE_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'FEEDING_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'FEEDING_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'APPOINTMENT_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'APPOINTMENT_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'WATER_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'WATER_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'MEDICATION_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'MEDICATION_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'BLOOD_SUGAR_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'BLOOD_SUGAR_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'SEIZURE_TRACKING_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'SEIZURE_TRACKING_DELETE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'MOVEMENT_UPDATE';
ALTER TYPE "TokenTransactionType" ADD VALUE 'MOVEMENT_DELETE';
