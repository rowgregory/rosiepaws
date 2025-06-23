/*
  Warnings:

  - Added the required column `cancelAtPeriodEnd` to the `StripeSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripeSubscription" ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN NOT NULL;
