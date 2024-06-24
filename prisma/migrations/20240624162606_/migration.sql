/*
  Warnings:

  - You are about to drop the column `CnicBackCopyUrl` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "CnicBackCopyUrl",
ADD COLUMN     "cnicBackCopyUrl" TEXT NOT NULL DEFAULT '';
