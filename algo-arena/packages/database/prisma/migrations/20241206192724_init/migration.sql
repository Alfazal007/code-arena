/*
  Warnings:

  - You are about to drop the column `fullCode` on the `Problems` table. All the data in the column will be lost.
  - You are about to drop the column `halfCode` on the `Problems` table. All the data in the column will be lost.
  - Added the required column `fullCodeJS` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullCodeRust` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `halfCodeJS` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `halfCodeRust` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problems" DROP COLUMN "fullCode",
DROP COLUMN "halfCode",
ADD COLUMN     "fullCodeJS" TEXT NOT NULL,
ADD COLUMN     "fullCodeRust" TEXT NOT NULL,
ADD COLUMN     "halfCodeJS" TEXT NOT NULL,
ADD COLUMN     "halfCodeRust" TEXT NOT NULL;
