/*
  Warnings:

  - You are about to drop the column `isClient` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isClient",
ADD COLUMN     "isBasicUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGuardian" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPremiumUser" BOOLEAN NOT NULL DEFAULT false;
