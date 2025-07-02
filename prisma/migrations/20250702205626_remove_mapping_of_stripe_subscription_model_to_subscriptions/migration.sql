-- CreateEnum
CREATE TYPE "TokenTransactionType" AS ENUM ('SIGNUP_BONUS', 'PURCHASE', 'USAGE', 'REFUND', 'BONUS', 'ADMIN_ADJUSTMENT');

-- AlterTable
ALTER TABLE "StripeSubscription" ADD COLUMN     "tokensIncluded" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastTokenReset" TIMESTAMP(3),
ADD COLUMN     "tokens" INTEGER NOT NULL DEFAULT 150,
ADD COLUMN     "tokensUsed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "token_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TokenTransactionType" NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "token_transactions_userId_createdAt_idx" ON "token_transactions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "StripeSubscription_userId_idx" ON "StripeSubscription"("userId");

-- AddForeignKey
ALTER TABLE "token_transactions" ADD CONSTRAINT "token_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
