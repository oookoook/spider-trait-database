-- Spider/Arachnid Trait Database — Order support migration
-- Issue #44: World ARACHNIDA Trait Database
-- Created: 2026-05-22

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- =============================================================================
-- PHASE 1: Create `order` table and insert seed data
-- =============================================================================

CREATE TABLE `spider_traits_db`.`order` (
  `id`   VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

INSERT INTO `spider_traits_db`.`order` (`id`, `name`) VALUES
  ('Araneae',          'Araneae'),
  ('Solifugae',         'Solifugae'),
  ('Scorpiones',        'Scorpiones'),
  ('Palpigradi',        'Palpigradi'),
  ('Uropygi',           'Uropygi'),
  ('Amblypygi',         'Amblypygi'),
  ('Schizomida',        'Schizomida'),
  ('Pseudoscorpiones',  'Pseudoscorpiones'),
  ('Ricinulei',         'Ricinulei'),
  ('Opiliones',         'Opiliones');

-- =============================================================================
-- PHASE 2: Fix Palpigradi typo and add FK constraint on taxonomy.order
-- =============================================================================

-- Fix leading-space typo introduced in arachnid-taxonomy-families.sql
UPDATE `spider_traits_db`.`taxonomy`
SET `order` = 'Palpigradi'
WHERE `order` = ' Palpigradi';

-- Add FK constraint (index order_idx already exists from arachnid-schema-changes.sql)
ALTER TABLE `spider_traits_db`.`taxonomy`
  ADD CONSTRAINT `taxonomy_order_fk`
  FOREIGN KEY (`order`) REFERENCES `spider_traits_db`.`order` (`id`)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

-- =============================================================================
-- PHASE 3: Add order_name FK column to reference, location, dataset
-- All existing records default to 'Araneae' (legacy spider-only data)
-- =============================================================================

ALTER TABLE `spider_traits_db`.`reference`
  ADD COLUMN `order_id` VARCHAR(255) NOT NULL DEFAULT 'Araneae' AFTER `abbrev`,
  ADD INDEX `reference_order_idx` (`order_id` ASC),
  ADD CONSTRAINT `reference_order_fk`
  FOREIGN KEY (`order_id`) REFERENCES `spider_traits_db`.`order` (`id`)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `spider_traits_db`.`location`
  ADD COLUMN `order_id` VARCHAR(255) NOT NULL DEFAULT 'Araneae' AFTER `note`,
  ADD INDEX `location_order_idx` (`order_id` ASC),
  ADD CONSTRAINT `location_order_fk`
  FOREIGN KEY (`order_id`) REFERENCES `spider_traits_db`.`order` (`id`)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `spider_traits_db`.`dataset`
  ADD COLUMN `order_id` VARCHAR(255) NOT NULL DEFAULT 'Araneae' AFTER `restricted`,
  ADD INDEX `dataset_order_idx` (`order_id` ASC),
  ADD CONSTRAINT `dataset_order_fk`
  FOREIGN KEY (`order_id`) REFERENCES `spider_traits_db`.`order` (`id`)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

-- =============================================================================
-- PHASE 4: Create trait_order and method_order junction tables,
-- backfill existing records as Araneae
-- =============================================================================

CREATE TABLE `spider_traits_db`.`trait_order` (
  `trait_id` INT          NOT NULL,
  `order_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`trait_id`, `order_id`),
  -- Secondary index so that WHERE order_id = ? can use an index
  -- (PK is (trait_id, order_id), so order_id alone would require a full scan)
  -- Including trait_id makes this a covering index for the junction table
  INDEX `trait_order_order_idx` (`order_id`, `trait_id`),
  CONSTRAINT `trait_order_trait_fk`
    FOREIGN KEY (`trait_id`) REFERENCES `spider_traits_db`.`trait` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `trait_order_order_fk`
    FOREIGN KEY (`order_id`) REFERENCES `spider_traits_db`.`order` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- All existing traits belong to Araneae
INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT `id`, 'Araneae' FROM `spider_traits_db`.`trait`;

CREATE TABLE `spider_traits_db`.`method_order` (
  `method_id` INT          NOT NULL,
  `order_id`  VARCHAR(255) NOT NULL,
  PRIMARY KEY (`method_id`, `order_id`),
  -- Secondary index so that WHERE order_id = ? can use an index
  INDEX `method_order_order_idx` (`order_id`, `method_id`),
  CONSTRAINT `method_order_method_fk`
    FOREIGN KEY (`method_id`) REFERENCES `spider_traits_db`.`method` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `method_order_order_fk`
    FOREIGN KEY (`order_id`) REFERENCES `spider_traits_db`.`order` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- All existing methods belong to Araneae
INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT `id`, 'Araneae' FROM `spider_traits_db`.`method`;

-- =============================================================================
-- PHASE 5: Add missing FK indexes on data table needed for order-based filtering
-- Without these, queries like JOIN taxonomy WHERE t.order = 'Araneae' or
-- JOIN trait_order WHERE order_name = 'Araneae' cause full scans of data
-- =============================================================================

ALTER TABLE `spider_traits_db`.`data`
  ADD INDEX `data_taxonomy_id_idx` (`taxonomy_id` ASC),
  ADD INDEX `data_trait_id_idx` (`trait_id` ASC);

-- =============================================================================
-- PHASE 6: Create views for order-filtered access to trait and method
-- Usage: SELECT * FROM trait_order_view WHERE order_name = 'Araneae'
-- =============================================================================

CREATE VIEW `spider_traits_db`.`trait_order_view` AS
  SELECT t.*, tor.`order_id`
  FROM `spider_traits_db`.`trait` t
  JOIN `spider_traits_db`.`trait_order` tor ON t.`id` = tor.`trait_id`;

CREATE VIEW `spider_traits_db`.`method_order_view` AS
  SELECT m.*, mor.`order_id`
  FROM `spider_traits_db`.`method` m
  JOIN `spider_traits_db`.`method_order` mor ON m.`id` = mor.`method_id`;

-- =============================================================================

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
