/*
  Warnings:

  - You are about to drop the column `intakeType` on the `Water` table. All the data in the column will be lost.
  - You are about to drop the column `relativeIntake` on the `Water` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "tokens" SET DEFAULT 750;

-- AlterTable
ALTER TABLE "Water" DROP COLUMN "intakeType",
DROP COLUMN "relativeIntake";
