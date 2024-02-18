-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "updatedAtMillis" DROP DEFAULT;

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "updatedAtMillis" DROP DEFAULT;

-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "updatedAtMillis" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "updatedAtMillis" DROP DEFAULT;

-- AlterTable
ALTER TABLE "trip_photos" ALTER COLUMN "updatedAtMillis" DROP DEFAULT;

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "updatedAtMillis" DROP DEFAULT;
