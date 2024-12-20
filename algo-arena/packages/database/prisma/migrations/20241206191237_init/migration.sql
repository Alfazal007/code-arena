/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Problems` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problems" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problems_name_key" ON "Problems"("name");
