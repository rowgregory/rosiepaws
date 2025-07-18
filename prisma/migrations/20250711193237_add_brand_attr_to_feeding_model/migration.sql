/*
  Warnings:

  - Added the required column `brand` to the `Feeding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feeding" ADD COLUMN     "brand" TEXT NOT NULL;
