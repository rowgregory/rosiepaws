/*
  Warnings:

  - You are about to drop the column `duration` on the `Walk` table. All the data in the column will be lost.
  - You are about to drop the column `timeWalked` on the `Walk` table. All the data in the column will be lost.
  - You are about to drop the `WaterIntake` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `intakeType` to the `Walk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `milliliters` to the `Walk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moodRating` to the `Walk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativeIntake` to the `Walk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeRecorded` to the `Walk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WaterIntake" DROP CONSTRAINT "WaterIntake_petId_fkey";

-- AlterTable
ALTER TABLE "Walk" DROP COLUMN "duration",
DROP COLUMN "timeWalked",
ADD COLUMN     "intakeType" TEXT NOT NULL,
ADD COLUMN     "milliliters" TEXT NOT NULL,
ADD COLUMN     "moodRating" TEXT NOT NULL,
ADD COLUMN     "relativeIntake" TEXT NOT NULL,
ADD COLUMN     "timeRecorded" TEXT NOT NULL;

-- DropTable
DROP TABLE "WaterIntake";

-- CreateTable
CREATE TABLE "Water" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timeGiven" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Water_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Water" ADD CONSTRAINT "Water_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
