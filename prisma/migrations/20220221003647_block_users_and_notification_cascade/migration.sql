-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_publishUserId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockUsers" INTEGER[];

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_publishUserId_fkey" FOREIGN KEY ("publishUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
