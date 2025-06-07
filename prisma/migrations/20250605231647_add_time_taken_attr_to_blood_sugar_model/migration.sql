/*
  Warnings:

  - Added the required column `timeTaken` to the `BloodSugar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BloodSugar" ADD COLUMN     "timeTaken" TIMESTAMP(3) NOT NULL;
