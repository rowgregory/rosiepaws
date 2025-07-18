/*
  Warnings:

  - Changed the type of `timeRecorded` on the `PainScore` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeRecorded` on the `Walk` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeRecorded` on the `Water` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PainScore" DROP COLUMN "timeRecorded",
ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Walk" DROP COLUMN "timeRecorded",
ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Water" DROP COLUMN "timeRecorded",
ADD COLUMN     "timeRecorded" TIMESTAMP(3) NOT NULL;
