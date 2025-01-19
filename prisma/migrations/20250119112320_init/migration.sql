-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('NFT_TRANSFER_PENDING', 'IN_PROGRESS', 'WINNER_CLAIM_PENDING', 'ENDED', 'START_PENDING');

-- CreateTable
CREATE TABLE "auctions" (
    "contract_address" TEXT NOT NULL,
    "owner_address" TEXT NOT NULL,
    "nft_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'NFT_TRANSFER_PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "auctions_contract_address_key" ON "auctions"("contract_address");
