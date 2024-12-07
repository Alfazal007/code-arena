/*
  Warnings:

  - You are about to drop the column `problemsId` on the `UserProblem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProblem" DROP CONSTRAINT "UserProblem_problemsId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserProblem" DROP COLUMN "problemsId",
ADD COLUMN     "completedTestCases" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "errorMessage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isErrorPresent" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "UserProblem" ADD CONSTRAINT "UserProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
