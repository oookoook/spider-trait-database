-- Apply to an existing database before enabling reference PDF routes.
CREATE TABLE `reference_pdf` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reference_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `size_bytes` INT UNSIGNED NOT NULL,
  `uploaded_at` DATETIME NOT NULL,
  `content` LONGBLOB NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_pdf_reference_unique` (`reference_id`),
  CONSTRAINT `reference_pdf_reference_fk` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;