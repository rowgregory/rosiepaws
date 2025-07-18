-- CreateEnum
CREATE TYPE "SeizureType" AS ENUM ('GENERALIZED', 'FOCAL', 'ABSENCE', 'MYOCLONIC', 'TONIC_CLONIC', 'ATONIC', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SeizureSeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'CRITICAL');

-- AlterTable
ALTER TABLE "Seizure" ADD COLUMN     "recoveryTime" INTEGER,
ADD COLUMN     "seizureType" "SeizureType" NOT NULL DEFAULT 'GENERALIZED',
ADD COLUMN     "severity" "SeizureSeverity" NOT NULL DEFAULT 'MILD',
ADD COLUMN     "triggerFactor" TEXT;
