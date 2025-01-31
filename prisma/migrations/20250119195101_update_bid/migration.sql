/*
  Warnings:

  - You are about to drop the column `auction_id` on the `bids` table. All the data in the column will be lost.
  - Added the required column `auction_address` to the `bids` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bids" DROP CONSTRAINT "bids_auction_id_fkey";

-- AlterTable
ALTER TABLE "bids" DROP COLUMN "auction_id",
ADD COLUMN     "auction_address" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_auction_address_fkey" FOREIGN KEY ("auction_address") REFERENCES "auctions"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;
