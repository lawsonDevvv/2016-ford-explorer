-- CreateTable
CREATE TABLE `Counting` (
    `server` VARCHAR(191) NOT NULL,
    `currentNumber` INTEGER NOT NULL,
    `lastCounter` VARCHAR(191) NOT NULL,
    `countedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Counting_server_key`(`server`),
    PRIMARY KEY (`server`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
