/*
  Warnings:

  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- AlterTable
ALTER TABLE "StripeSubscription" ALTER COLUMN "plan" SET DEFAULT 'COMFORT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isProUser" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Journal";
