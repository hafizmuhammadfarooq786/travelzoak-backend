-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "cloudinaryCoverPublicId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cloudinaryThumbnailPublicId" TEXT NOT NULL DEFAULT '';
