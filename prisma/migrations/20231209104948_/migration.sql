/*
  Warnings:

  - You are about to drop the column `linceseNo` on the `partners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partners" DROP COLUMN "linceseNo",
ADD COLUMN     "licenseNo" TEXT NOT NULL DEFAULT '';
