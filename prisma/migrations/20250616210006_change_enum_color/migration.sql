/*
  Warnings:

  - The values [BLACK,WHITE,BROWN,YELLOW,RED,PURPLE,GREEN,BLUE,GREY,BLACK_WHITE,ORANGE] on the enum `Photo_color` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Photo` MODIFY `color` ENUM('black', 'white', 'brown', 'yellow', 'red', 'purple', 'green', 'blue', 'grey', 'blackwhite', 'orange') NOT NULL;
