/*
  Warnings:

  - Added the required column `duration` to the `Walk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Walk" ADD COLUMN     "duration" TEXT NOT NULL;
