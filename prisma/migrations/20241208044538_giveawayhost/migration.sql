/*
  Warnings:

  - You are about to drop the column `winner` on the `Giveaway` table. All the data in the column will be lost.
  - Added the required column `host` to the `Giveaway` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Giveaway` DROP COLUMN `winner`,
    ADD COLUMN `host` VARCHAR(191) NOT NULL;
