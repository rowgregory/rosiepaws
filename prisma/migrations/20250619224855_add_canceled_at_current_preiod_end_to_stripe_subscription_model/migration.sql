-- AlterTable
ALTER TABLE "StripeSubscription" ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3);
