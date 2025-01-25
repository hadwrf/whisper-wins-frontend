/*
  Warnings:

  - The values [WINNER_CLAIM_PENDING] on the enum `AuctionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuctionStatus_new" AS ENUM ('NFT_TRANSFER_ADDRESS_PENDING', 'NFT_TRANSFER_PENDING', 'START_PENDING', 'IN_PROGRESS', 'EARNING_CLAIM_PENDING', 'ENDED');
ALTER TABLE "auctions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "auctions" ALTER COLUMN "status" TYPE "AuctionStatus_new" USING ("status"::text::"AuctionStatus_new");
ALTER TYPE "AuctionStatus" RENAME TO "AuctionStatus_old";
ALTER TYPE "AuctionStatus_new" RENAME TO "AuctionStatus";
DROP TYPE "AuctionStatus_old";
ALTER TABLE "auctions" ALTER COLUMN "status" SET DEFAULT 'NFT_TRANSFER_PENDING';
COMMIT;
