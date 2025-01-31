-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('ACTIVE', 'WINNER', 'LOSER');

-- CreateTable
CREATE TABLE "bids" (
    "id" SERIAL NOT NULL,
    "auction_id" TEXT NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;
