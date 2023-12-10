-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT '',
    "phoneCountryCode" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "cnicNumber" TEXT NOT NULL DEFAULT '',
    "cnicExpiry" TEXT NOT NULL DEFAULT '',
    "cnicFrontPhotoUrl" TEXT NOT NULL DEFAULT '',
    "CnicBackCopyUrl" TEXT NOT NULL DEFAULT '',
    "roleId" TEXT NOT NULL DEFAULT '',
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "expiresAtMillis" BIGINT NOT NULL,

    CONSTRAINT "user_auth_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "expiresAtMillis" BIGINT NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_information" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "contact_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_social_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "website" TEXT NOT NULL DEFAULT '',
    "facebook" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "youtube" TEXT NOT NULL DEFAULT '',
    "tiktok" TEXT NOT NULL DEFAULT '',
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "user_social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverPhotoUrl" TEXT NOT NULL DEFAULT '',
    "backgroundUrl" TEXT NOT NULL DEFAULT '',
    "thumbnailUrl" TEXT NOT NULL DEFAULT '',
    "latitude" TEXT NOT NULL DEFAULT '',
    "longitude" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "isLicensed" BOOLEAN NOT NULL DEFAULT false,
    "LinceseNo" TEXT NOT NULL DEFAULT '',
    "LicenseCopyURL" TEXT NOT NULL DEFAULT '',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT NOT NULL DEFAULT '',
    "endDate" TEXT NOT NULL DEFAULT '',
    "startDesitination" TEXT NOT NULL DEFAULT '',
    "endDestination" TEXT NOT NULL DEFAULT '',
    "totalDays" INTEGER NOT NULL DEFAULT 0,
    "totalSeats" INTEGER NOT NULL DEFAULT 0,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "perPersonCharges" INTEGER NOT NULL DEFAULT 0,
    "coupleCharges" INTEGER NOT NULL DEFAULT 0,
    "familyCharges" INTEGER NOT NULL DEFAULT 0,
    "advancePayment" INTEGER NOT NULL DEFAULT 0,
    "roomSharing" INTEGER NOT NULL DEFAULT 0,
    "coverPhotoUrl" TEXT NOT NULL DEFAULT '',
    "thumbnailUrl" TEXT NOT NULL DEFAULT '',
    "placesIncluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "servicesIncluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "servicesExcluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "partnerId" TEXT NOT NULL DEFAULT '',
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_photos" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "photosUrl" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "trip_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAtMillis" BIGINT NOT NULL,
    "updatedAtMillis" BIGINT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_codes_id_key" ON "user_auth_codes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_codes_code_key" ON "user_auth_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_id_key" ON "refresh_tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_deviceId_key" ON "refresh_tokens"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_id_key" ON "user_roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_name_key" ON "user_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "contact_information_id_key" ON "contact_information"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_information_userId_key" ON "contact_information"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_social_links_id_key" ON "user_social_links"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_social_links_userId_key" ON "user_social_links"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_id_key" ON "destinations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_name_key" ON "destinations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "partners_id_key" ON "partners"("id");

-- CreateIndex
CREATE UNIQUE INDEX "partners_name_key" ON "partners"("name");

-- CreateIndex
CREATE UNIQUE INDEX "partners_slug_key" ON "partners"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "trips_id_key" ON "trips"("id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_photos_id_key" ON "trip_photos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_photos_tripId_key" ON "trip_photos"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_id_key" ON "categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
