/*
  Warnings:

  - You are about to drop the column `postId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Follower` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postPostId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUsername` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postPostId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUsername` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUsername` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Follower" DROP CONSTRAINT "Follower_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follower" DROP CONSTRAINT "Follower_followingId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "postId",
DROP COLUMN "userId",
ADD COLUMN     "parentCommentId" INTEGER,
ADD COLUMN     "postPostId" INTEGER NOT NULL,
ADD COLUMN     "userUsername" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "postId",
DROP COLUMN "userId",
ADD COLUMN     "postPostId" INTEGER NOT NULL,
ADD COLUMN     "userUsername" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageUrl",
DROP COLUMN "userId",
ADD COLUMN     "picture" TEXT NOT NULL,
ADD COLUMN     "userUsername" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "bio",
DROP COLUMN "userId",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("username");

-- DropTable
DROP TABLE "Follower";

-- CreateTable
CREATE TABLE "Follows" (
    "followerUsername" TEXT NOT NULL,
    "followedUsername" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerUsername","followedUsername")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postPostId_fkey" FOREIGN KEY ("postPostId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("commentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postPostId_fkey" FOREIGN KEY ("postPostId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerUsername_fkey" FOREIGN KEY ("followerUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followedUsername_fkey" FOREIGN KEY ("followedUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
