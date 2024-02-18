/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `trips` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "title" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "trips_slug_key" ON "trips"("slug");
