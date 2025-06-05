/*
  Warnings:

  - Added the required column `foodAmount` to the `Feeding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feeding" ADD COLUMN     "foodAmount" TEXT NOT NULL;
