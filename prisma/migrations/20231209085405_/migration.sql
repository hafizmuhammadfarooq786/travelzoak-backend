/*
  Warnings:

  - You are about to drop the column `LicenseCopyURL` on the `partners` table. All the data in the column will be lost.
  - You are about to drop the column `LinceseNo` on the `partners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partners" DROP COLUMN "LicenseCopyURL",
DROP COLUMN "LinceseNo",
ADD COLUMN     "licenseCopyURL" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "linceseNo" TEXT NOT NULL DEFAULT '';
