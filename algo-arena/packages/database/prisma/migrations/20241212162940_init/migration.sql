/*
  Warnings:

  - Added the required column `problemDescription` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problems" ADD COLUMN     "problemDescription" TEXT NOT NULL;
