/*
  Warnings:

  - Made the column `order` on table `Photo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Photo` MODIFY `order` INTEGER NOT NULL;
