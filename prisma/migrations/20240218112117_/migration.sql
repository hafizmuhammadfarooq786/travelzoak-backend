/*
  Warnings:

  - You are about to drop the column `status` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `bookingStatus` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "status",
ADD COLUMN     "bookingStatus" BOOLEAN NOT NULL,
ADD COLUMN     "paymentStatus" BOOLEAN NOT NULL;
