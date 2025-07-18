-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "allergies" DROP NOT NULL,
ALTER COLUMN "emergencyContactName" DROP NOT NULL,
ALTER COLUMN "emergencyContactPhone" DROP NOT NULL,
ALTER COLUMN "microchipId" DROP NOT NULL;
