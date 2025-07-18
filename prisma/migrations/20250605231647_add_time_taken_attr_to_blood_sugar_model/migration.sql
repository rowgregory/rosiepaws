/*
  Warnings:

  - Added the required column `timeRecorded` to the `BloodSugar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BloodSugar" ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;
