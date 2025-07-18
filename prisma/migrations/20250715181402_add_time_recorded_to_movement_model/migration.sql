/*
  Warnings:

  - Added the required column `timeRecorded` to the `Movement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;
