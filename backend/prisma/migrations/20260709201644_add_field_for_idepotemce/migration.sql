/*
  Warnings:

  - A unique constraint covering the columns `[data_hash]` on the table `fighter_stats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data_hash` to the `fighter_stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fighter_stats" ADD COLUMN     "data_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "fighter_stats_data_hash_key" ON "fighter_stats"("data_hash");
