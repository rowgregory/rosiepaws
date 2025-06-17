/*
  Warnings:

  - You are about to drop the column `amount` on the `Water` table. All the data in the column will be lost.
  - You are about to drop the column `timeGiven` on the `Water` table. All the data in the column will be lost.
  - You are about to drop the `Walk` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `intakeType` to the `Water` table without a default value. This is not possible if the table is not empty.
  - Added the required column `milliliters` to the `Water` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moodRating` to the `Water` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativeIntake` to the `Water` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeRecorded` to the `Water` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Walk" DROP CONSTRAINT "Walk_petId_fkey";

-- AlterTable
ALTER TABLE "Water" DROP COLUMN "amount",
DROP COLUMN "timeGiven",
ADD COLUMN     "intakeType" TEXT NOT NULL,
ADD COLUMN     "milliliters" TEXT NOT NULL,
ADD COLUMN     "moodRating" TEXT NOT NULL,
ADD COLUMN     "relativeIntake" TEXT NOT NULL,
ADD COLUMN     "timeRecorded" TEXT NOT NULL;

-- DropTable
DROP TABLE "Walk";
