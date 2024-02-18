/*
  Warnings:

  - You are about to drop the column `photos` on the `trip_photos` table. All the data in the column will be lost.
  - Added the required column `cloudinaryPublicId` to the `trip_photos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoUrl` to the `trip_photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trip_photos" DROP COLUMN "photos",
ADD COLUMN     "cloudinaryPublicId" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT NOT NULL;
