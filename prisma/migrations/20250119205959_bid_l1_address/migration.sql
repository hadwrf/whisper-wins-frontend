/*
  Warnings:

  - Added the required column `l1_address` to the `bids` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bids" ADD COLUMN     "l1_address" TEXT NOT NULL;
