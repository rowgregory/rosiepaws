/*
  Warnings:

  - A unique constraint covering the columns `[vetId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vetId" TEXT;

-- CreateTable
CREATE TABLE "Vet" (
    "id" TEXT NOT NULL,
    "vetName" TEXT NOT NULL,
    "clinicName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Vet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_vetId_key" ON "User"("vetId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Vet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
