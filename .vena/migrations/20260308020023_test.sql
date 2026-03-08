/*M!999999\- enable the sandbox mode */ 
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Family` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `familyId` varchar(191) NOT NULL,
  `familyName` varchar(255) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Family_familyId_key` (`familyId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthRecord` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `recordId` varchar(191) NOT NULL,
  `ownerUserId` int(10) unsigned NOT NULL,
  `familyId` int(10) unsigned NOT NULL,
  `createdBy` int(10) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthRecord_recordId_key` (`recordId`),
  KEY `HealthRecord_ownerUserId_idx` (`ownerUserId`),
  KEY `HealthRecord_familyId_idx` (`familyId`),
  KEY `HealthRecord_createdBy_idx` (`createdBy`),
  CONSTRAINT `HealthRecord_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `HealthRecord_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `HealthRecord_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `healthRecordId` int(10) unsigned NOT NULL,
  `canEdit` tinyint(1) NOT NULL DEFAULT 0,
  `canDelete` tinyint(1) NOT NULL DEFAULT 0,
  `canShare` tinyint(1) NOT NULL DEFAULT 0,
  `canView` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permissions_userId_healthRecordId_key` (`userId`,`healthRecordId`),
  KEY `Permissions_healthRecordId_idx` (`healthRecordId`),
  KEY `Permissions_userId_idx` (`userId`),
  CONSTRAINT `Permissions_healthRecordId_fkey` FOREIGN KEY (`healthRecordId`) REFERENCES `HealthRecord` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `RefreshToken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expiresAt` datetime(3) NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RefreshToken_token_key` (`token`),
  KEY `RefreshToken_userId_idx` (`userId`),
  CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) NOT NULL,
  `familyId` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Owner','Member') NOT NULL DEFAULT 'Member',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_userId_key` (`userId`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_familyId_idx` (`familyId`),
  KEY `User_id_familyId_idx` (`id`,`familyId`),
  CONSTRAINT `User_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
