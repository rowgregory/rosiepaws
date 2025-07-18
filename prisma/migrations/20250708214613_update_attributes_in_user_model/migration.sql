/*
  Warnings:

  - You are about to drop the column `isBasicUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPremiumUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isProUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `securityAnswerHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `securityQuestion` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isBasicUser",
DROP COLUMN "isPremiumUser",
DROP COLUMN "isProUser",
DROP COLUMN "password",
DROP COLUMN "securityAnswerHash",
DROP COLUMN "securityQuestion",
ADD COLUMN     "isComfortUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCompanionUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLegacyUser" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'Free';
