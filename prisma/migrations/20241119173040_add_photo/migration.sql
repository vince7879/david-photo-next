/*
  Warnings:

  - Added the required column `photoUrl` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `photoUrl` VARCHAR(191) NOT NULL;
