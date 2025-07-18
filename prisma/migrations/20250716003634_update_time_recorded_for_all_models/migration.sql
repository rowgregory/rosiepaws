/*
  Warnings:

  - You are about to drop the column `timeRecorded` on the `BloodSugar` table. All the data in the column will be lost.
  - You are about to drop the column `timeFed` on the `Feeding` table. All the data in the column will be lost.
  - You are about to drop the column `timeRecorded` on the `Seizure` table. All the data in the column will be lost.
  - Added the required column `timeRecorded` to the `BloodSugar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeRecorded` to the `Feeding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeRecorded` to the `Seizure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BloodSugar" DROP COLUMN "timeRecorded",
ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Feeding" DROP COLUMN "timeFed",
ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Seizure" DROP COLUMN "timeRecorded",
ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;
