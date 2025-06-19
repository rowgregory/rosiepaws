/*
  Warnings:

  - You are about to drop the `SeizureActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SeizureActivity" DROP CONSTRAINT "SeizureActivity_petId_fkey";

-- DropTable
DROP TABLE "SeizureActivity";

-- CreateTable
CREATE TABLE "Seizure" (
    "id" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "notes" TEXT,
    "videoUrl" TEXT,
    "videoFilename" TEXT,
    "hadSeizure" TEXT,
    "dailyCount" INTEGER,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seizure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seizure" ADD CONSTRAINT "Seizure_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
