-- CreateTable
CREATE TABLE `UserDao` (
    `andrewId` VARCHAR(191) NOT NULL,
    `teamDaoGithubUsername` VARCHAR(191) NULL,

    PRIMARY KEY (`andrewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamDao` (
    `githubUsername` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`githubUsername`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMatchDao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `bankroll` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchDao` (
    `matchId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`matchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserDao` ADD CONSTRAINT `UserDao_teamDaoGithubUsername_fkey` FOREIGN KEY (`teamDaoGithubUsername`) REFERENCES `TeamDao`(`githubUsername`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamMatchDao` ADD CONSTRAINT `TeamMatchDao_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `MatchDao`(`matchId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamMatchDao` ADD CONSTRAINT `TeamMatchDao_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `TeamDao`(`githubUsername`) ON DELETE RESTRICT ON UPDATE CASCADE;
