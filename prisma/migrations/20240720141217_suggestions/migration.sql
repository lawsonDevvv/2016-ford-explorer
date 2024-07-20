-- CreateTable
CREATE TABLE `Suggestion` (
    `id` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `suggestion` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `editedBy` VARCHAR(191) NOT NULL DEFAULT 'Nobody',
    `editedAt` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',

    UNIQUE INDEX `Suggestion_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
