/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Photo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `year` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Photo_publicId_key` ON `Photo`(`publicId`);
