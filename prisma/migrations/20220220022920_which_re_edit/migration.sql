/*
  Warnings:

  - The values [FOLLOWING_POST,MY_POST_LIKE,MY_POST_COMMENT,MY_COMMENT_LIKE,MY_COMMENT_OF_COMMENT_LIKE,MY_COMMENT_OF_COMMENT_GET_COMMENT] on the enum `WhichNotification` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WhichNotification_new" AS ENUM ('FOLLOWING_WRITE_POST', 'MY_POST_GET_LIKE', 'MY_POST_GET_COMMENT', 'MY_COMMENT_GET_LIKE', 'MY_COMMENT_GET_COMMENT', 'MY_COMMENT_OF_COMMENT_GET_LIKE', 'FOLLOW_ME');
ALTER TABLE "Notification" ALTER COLUMN "which" TYPE "WhichNotification_new" USING ("which"::text::"WhichNotification_new");
ALTER TYPE "WhichNotification" RENAME TO "WhichNotification_old";
ALTER TYPE "WhichNotification_new" RENAME TO "WhichNotification";
DROP TYPE "WhichNotification_old";
COMMIT;
