/*
  Warnings:

  - You are about to drop the column `dailyCount` on the `Seizure` table. All the data in the column will be lost.
  - You are about to drop the column `hadSeizure` on the `Seizure` table. All the data in the column will be lost.
  - You are about to drop the column `occurredAt` on the `Seizure` table. All the data in the column will be lost.
  - Added the required column `timeRecorded` to the `Seizure` table without a default value. This is not possible if the table is not empty.
  - Made the column `duration` on table `Seizure` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Seizure" DROP COLUMN "dailyCount",
DROP COLUMN "hadSeizure",
DROP COLUMN "occurredAt",
ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "duration" SET NOT NULL;
