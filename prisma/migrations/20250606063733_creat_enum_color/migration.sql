/*
  Warnings:

  - You are about to alter the column `color` on the `Photo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Photo` MODIFY `color` ENUM('BLACK', 'WHITE', 'BROWN', 'YELLOW', 'RED', 'PURPLE', 'GREEN', 'BLUE', 'GREY', 'BLACK_WHITE', 'ORANGE') NOT NULL;
