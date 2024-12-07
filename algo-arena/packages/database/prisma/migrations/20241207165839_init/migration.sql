-- DropForeignKey
ALTER TABLE "UserProblem" DROP CONSTRAINT "UserProblem_problemId_fkey";

-- DropForeignKey
ALTER TABLE "UserProblem" DROP CONSTRAINT "UserProblem_userId_fkey";

-- AlterTable
ALTER TABLE "Problems" ADD COLUMN     "inputTakingCodeJS" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "inputTakingCodeRust" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "UserProblem" ADD CONSTRAINT "UserProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProblem" ADD CONSTRAINT "UserProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
