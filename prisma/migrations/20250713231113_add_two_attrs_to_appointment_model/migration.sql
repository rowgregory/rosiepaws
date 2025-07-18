/*
  Warnings:

  - Added the required column `reminderEnabled` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminderTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "reminderEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "reminderTime" TEXT NOT NULL;
