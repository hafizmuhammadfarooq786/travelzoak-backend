/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `photosUrl` on the `trip_photos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingDate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPayment` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripEndDate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripStartDate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bookings_tripId_key";

-- DropIndex
DROP INDEX "bookings_userId_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "totalAmount",
ADD COLUMN     "bookingDate" TEXT NOT NULL,
ADD COLUMN     "totalPayment" INTEGER NOT NULL,
ADD COLUMN     "tripEndDate" TEXT NOT NULL,
ADD COLUMN     "tripStartDate" TEXT NOT NULL,
ALTER COLUMN "totalSeats" DROP DEFAULT,
ALTER COLUMN "advancePayment" DROP DEFAULT,
ALTER COLUMN "remainingAmount" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "trip_photos" DROP COLUMN "photosUrl",
ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_key" ON "reviews"("userId");
