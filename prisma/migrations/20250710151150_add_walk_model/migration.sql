-- CreateTable
CREATE TABLE "Walk" (
    "id" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "pace" TEXT NOT NULL,
    "distraction" TEXT NOT NULL,
    "moodRating" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Walk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Walk" ADD CONSTRAINT "Walk_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
