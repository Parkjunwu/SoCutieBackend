-- DropForeignKey
ALTER TABLE "UserOnRoom" DROP CONSTRAINT "UserOnRoom_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserOnRoom" ADD CONSTRAINT "UserOnRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
