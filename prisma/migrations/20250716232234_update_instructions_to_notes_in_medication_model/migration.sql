/*
  Warnings:

  - You are about to drop the column `instructions` on the `Medication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "instructions",
ADD COLUMN     "notes" TEXT;
