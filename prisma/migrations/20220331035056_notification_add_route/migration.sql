-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "commentId" INTEGER,
ADD COLUMN     "commentOfCommentId" INTEGER,
ADD COLUMN     "postId" INTEGER,
ADD COLUMN     "userId" INTEGER;
