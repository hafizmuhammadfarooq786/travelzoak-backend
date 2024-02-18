-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL DEFAULT '',
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "advancePayment" INTEGER NOT NULL DEFAULT 0,
    "remainingAmount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT '',
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_id_key" ON "reviews"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_tripId_key" ON "reviews"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_id_key" ON "bookings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_userId_key" ON "bookings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_tripId_key" ON "bookings"("tripId");
