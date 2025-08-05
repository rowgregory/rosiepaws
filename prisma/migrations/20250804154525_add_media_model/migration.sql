-- CreateEnum
CREATE TYPE "MediaColor" AS ENUM ('BLUE', 'PURPLE', 'GREEN', 'ORANGE', 'RED', 'INDIGO', 'PINK', 'YELLOW', 'GRAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MediaType" ADD VALUE 'POSTER';
ALTER TYPE "MediaType" ADD VALUE 'EBOOK';
ALTER TYPE "MediaType" ADD VALUE 'DOCUMENT';

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "MediaType" NOT NULL,
    "format" VARCHAR(10) NOT NULL,
    "size" VARCHAR(20) NOT NULL,
    "sizeBytes" BIGINT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT,
    "color" "MediaColor" NOT NULL DEFAULT 'BLUE',
    "fileName" VARCHAR(255) NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_uploadDate_idx" ON "media"("uploadDate");

-- CreateIndex
CREATE INDEX "media_isActive_idx" ON "media"("isActive");
