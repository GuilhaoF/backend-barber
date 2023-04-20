/*
  Warnings:

  - You are about to drop the column `userId` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_userId_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
