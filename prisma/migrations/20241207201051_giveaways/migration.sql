-- CreateTable
CREATE TABLE `Giveaway` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `channelId` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `prize` VARCHAR(191) NOT NULL,
    `winners` INTEGER NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `winner` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GiveawayParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `giveawayId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GiveawayParticipant_giveawayId_userId_key`(`giveawayId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GiveawayParticipant` ADD CONSTRAINT `GiveawayParticipant_giveawayId_fkey` FOREIGN KEY (`giveawayId`) REFERENCES `Giveaway`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
