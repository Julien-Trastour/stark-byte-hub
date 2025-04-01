/*
  Warnings:

  - Added the required column `color` to the `Robot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Robot" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "controllable" BOOLEAN NOT NULL DEFAULT true;
