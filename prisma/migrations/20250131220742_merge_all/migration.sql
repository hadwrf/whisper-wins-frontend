/*
  Warnings:

  - The values [EARNING_CLAIM_PENDING,ENDED] on the enum `AuctionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `message` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_bid` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auction_address` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nft_address` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nft_name` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nft_token_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('AUCTION_TIME_END', 'AUCTION_WON', 'AUCTION_LOST', 'CLAIM_HIGHEST_BID');

-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('AUCTIONEER', 'BIDDER');

-- AlterEnum
BEGIN;
CREATE TYPE "AuctionStatus_new" AS ENUM ('NFT_TRANSFER_ADDRESS_PENDING', 'NFT_TRANSFER_PENDING', 'START_PENDING', 'IN_PROGRESS', 'TIME_ENDED', 'RESOLVED');
ALTER TABLE "auctions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "auctions" ALTER COLUMN "status" TYPE "AuctionStatus_new" USING ("status"::text::"AuctionStatus_new");
ALTER TYPE "AuctionStatus" RENAME TO "AuctionStatus_old";
ALTER TYPE "AuctionStatus_new" RENAME TO "AuctionStatus";
DROP TYPE "AuctionStatus_old";
ALTER TABLE "auctions" ALTER COLUMN "status" SET DEFAULT 'NFT_TRANSFER_ADDRESS_PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "minimum_bid" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "nft_transfer_address" TEXT,
ADD COLUMN     "result_claimed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "winner_address" TEXT,
ALTER COLUMN "status" SET DEFAULT 'NFT_TRANSFER_ADDRESS_PENDING';

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "message",
ADD COLUMN     "auction_address" TEXT NOT NULL,
ADD COLUMN     "clicked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nft_address" TEXT NOT NULL,
ADD COLUMN     "nft_name" TEXT NOT NULL,
ADD COLUMN     "nft_token_id" TEXT NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'AUCTION_TIME_END',
ADD COLUMN     "user_type" "ParticipantType" NOT NULL DEFAULT 'BIDDER';
