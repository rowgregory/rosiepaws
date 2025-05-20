-- CreateTable
CREATE TABLE "PainScore" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PainScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PainScore" ADD CONSTRAINT "PainScore_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
