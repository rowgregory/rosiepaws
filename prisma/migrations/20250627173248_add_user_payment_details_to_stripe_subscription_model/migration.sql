-- AlterTable
ALTER TABLE "StripeSubscription" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentMethodBrand" TEXT,
ADD COLUMN     "paymentMethodLast4" TEXT;
