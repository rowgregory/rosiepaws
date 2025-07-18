/*
  Warnings:

  - Changed the type of `moodRating` on the `Water` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Water" DROP COLUMN "moodRating",
ADD COLUMN     "moodRating" INTEGER NOT NULL;
