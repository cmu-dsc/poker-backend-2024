/*
  Warnings:

  - A unique constraint covering the columns `[matchId]` on the table `MatchDao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubUsername]` on the table `TeamDao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `TeamMatchDao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[andrewId]` on the table `UserDao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `MatchDao_matchId_key` ON `MatchDao`(`matchId`);

-- CreateIndex
CREATE UNIQUE INDEX `TeamDao_githubUsername_key` ON `TeamDao`(`githubUsername`);

-- CreateIndex
CREATE UNIQUE INDEX `TeamMatchDao_id_key` ON `TeamMatchDao`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `UserDao_andrewId_key` ON `UserDao`(`andrewId`);
