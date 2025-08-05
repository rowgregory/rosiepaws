/*
  Warnings:

  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "media";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "Media"("type");

-- CreateIndex
CREATE INDEX "Media_uploadDate_idx" ON "Media"("uploadDate");

-- CreateIndex
CREATE INDEX "Media_isActive_idx" ON "Media"("isActive");
