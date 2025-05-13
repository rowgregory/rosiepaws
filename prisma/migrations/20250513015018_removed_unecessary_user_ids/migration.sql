/*
  Warnings:

  - You are about to drop the column `userId` on the `BloodSugar` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Feeding` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Walk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BloodSugar" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Feeding" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Walk" DROP COLUMN "userId";
