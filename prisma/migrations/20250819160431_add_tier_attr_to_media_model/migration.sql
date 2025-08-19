-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "tokens" SET DEFAULT 180;
