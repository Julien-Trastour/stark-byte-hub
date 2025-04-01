-- DropForeignKey
ALTER TABLE "Robot" DROP CONSTRAINT "Robot_userId_fkey";

-- AlterTable
ALTER TABLE "Robot" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Robot" ADD CONSTRAINT "Robot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
