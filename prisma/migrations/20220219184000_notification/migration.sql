-- CreateEnum
CREATE TYPE "WhichNotification" AS ENUM ('FollowingPost', 'MyPostLike', 'MyPostComment', 'MyCommentLike', 'MyCommentGetComment', 'MyCommentOfCommentLike', 'MyCommentOfCommentGetComment');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "which" "WhichNotification" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
