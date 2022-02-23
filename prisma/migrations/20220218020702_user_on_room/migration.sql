/*
  Warnings:

  - You are about to drop the `RoomOnMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomOnMessage" DROP CONSTRAINT "RoomOnMessage_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomOnMessage" DROP CONSTRAINT "RoomOnMessage_userId_fkey";

-- DropTable
DROP TABLE "RoomOnMessage";

-- CreateTable
CREATE TABLE "UserOnRoom" (
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "UserOnRoom_pkey" PRIMARY KEY ("userId","roomId")
);

-- AddForeignKey
ALTER TABLE "UserOnRoom" ADD CONSTRAINT "UserOnRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnRoom" ADD CONSTRAINT "UserOnRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
