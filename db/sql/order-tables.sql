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

-- =============================================================================
-- PHASE 7: Fill trait_order for the 9 non-Araneae orders (existing traits)
-- Strategy: insert all traits currently in the table for each order, then
--           exclude those where the spec marks the trait as inapplicable (0).
-- Source:   db/sql/tmp/methods_traits_orders.md
-- Note:     Column header 'Pseudoscopriones' in the source is a typo for
--           'Pseudoscorpiones'.
-- Note:     This phase must run while only the original Araneae trait set is
--           present (i.e. before Phase 9 adds new order-specific traits).
-- =============================================================================

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Scorpiones'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('soci', 'halo');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Opiliones'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('vgsi', 'vgle', 'vgwi', 'bule', 'suaf',
                            'ld50', 'vepr', 'toxt', 'veyl', 'para');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Solifugae'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('vgsi', 'vgle', 'vgwi', 'soci', 'halo', 'suaf',
                            'ld50', 'vepr', 'toxt', 'veyl', 'para');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Ricinulei'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('vgsi', 'vgle', 'vgwi', 'fred', 'freq', 'soun',
                            'sour', 'freu', 'modl', 'soci', 'halo', 'suaf',
                            'bule', 'ld50', 'vepr', 'toxt', 'veyl', 'para');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Uropygi'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('vgsi', 'vgle', 'vgwi', 'fred', 'freq', 'soun',
                            'sour', 'freu', 'modl', 'soci', 'halo', 'suaf',
                            'bule', 'mtL1', 'mtL2', 'mtL3', 'mtL4',
                            'ld50', 'vepr', 'toxt', 'veyl', 'para');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Amblypygi'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('vgsi', 'vgle', 'vgwi', 'modl', 'halo', 'bule',
                            'tiL1', 'tiL2', 'tiL3', 'tiL4',
                            'ld50', 'vepr', 'toxt', 'veyl', 'para');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Pseudoscorpiones'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('fred', 'freq', 'soun', 'sour', 'freu', 'modl',
                            'bule', 'mtL1', 'mtL2', 'mtL3', 'mtL4',
                            'paL1', 'paL2', 'paL3', 'paL4',
                            'tro1', 'tro2', 'tro3', 'tro4');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Schizomida'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('vgsi', 'vgle', 'vgwi', 'fred', 'freq', 'soun',
                            'sour', 'freu', 'modl', 'soci', 'halo', 'suaf',
                            'bule', 'mtL1', 'mtL2', 'mtL3', 'mtL4',
                            'ld50', 'vepr', 'toxt', 'veyl', 'para');

INSERT INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, 'Palpigradi'
  FROM `spider_traits_db`.`trait` t
  WHERE t.`abbrev` NOT IN ('vgsi', 'vgle', 'vgwi', 'fred', 'freq', 'soun',
                            'sour', 'freu', 'modl', 'soci', 'halo', 'bule',
                            'mtL1', 'mtL2', 'mtL3', 'mtL4',
                            'paL1', 'paL2', 'paL3', 'paL4',
                            'tro1', 'tro2', 'tro3', 'tro4',
                            'tarp', 'ld50', 'vepr', 'toxt', 'veyl', 'para');

-- =============================================================================
-- PHASE 8: Fill method_order for the 9 non-Araneae orders (existing methods)
-- Exceptions derived from the 'methods' sheet in methods_traits_orders.md:
--   tox / ven / vex  →  Scorpiones + Pseudoscorpiones only
--   sou              →  Scorpiones + Opiliones + Solifugae + Amblypygi only
-- =============================================================================

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Scorpiones'
  FROM `spider_traits_db`.`method` m;

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Opiliones'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('tox', 'ven', 'vex');

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Solifugae'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('tox', 'ven', 'vex');

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Ricinulei'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('tox', 'sou', 'ven', 'vex');

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Uropygi'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('tox', 'sou', 'ven', 'vex');

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Amblypygi'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('tox', 'ven', 'vex');

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Pseudoscorpiones'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('sou');

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Schizomida'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('tox', 'sou', 'ven', 'vex');

INSERT INTO `spider_traits_db`.`method_order` (`method_id`, `order_id`)
  SELECT m.`id`, 'Palpigradi'
  FROM `spider_traits_db`.`method` m
  WHERE m.`abbrev` NOT IN ('tox', 'sou', 'ven', 'vex');

-- =============================================================================
-- PHASE 9: Insert new order-specific traits and their trait_order entries
-- These traits are not part of the original Araneae trait set; they appear
-- only in the bottom section of methods_traits_orders.md (with explicit
-- data_type / unit values).
-- INSERT IGNORE is used so that the script is re-runnable without errors.
--
-- Note: 'scle' in the source spreadsheet (Scutum length, Opiliones) conflicts
--       with the existing trait 'scle' (Sclerotisation, Anatomy). The new trait
--       is inserted here with the resolved abbreviation 'sule'.
-- =============================================================================

-- ── Amblypygi ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('trLp',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Palpal trochanter length', 'Length of trochanter of pedipalp',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('btiL1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Basitibia I length',    'Length of basitibia on leg I',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('btiL2', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Basitibia II length',   'Length of basitibia on leg II',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('btiL3', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Basitibia III length',  'Length of basitibia on leg III',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('btiL4', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Basitibia IV length',   'Length of basitibia on leg IV',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('dtiL1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Distitibia I length',   'Length of distitibia on leg I',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('dtiL2', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Distitibia II length',  'Length of distitibia on leg II',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('dtiL3', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Distitibia III length', 'Length of distitibia on leg III',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('dtiL4', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Distitibia IV length',  'Length of distitibia on leg IV',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Amblypygi' FROM `spider_traits_db`.`trait`
  WHERE abbrev IN ('btiL1','btiL2','btiL3','btiL4','dtiL1','dtiL2','dtiL3','dtiL4');

-- trLp: Amblypygi + Pseudoscorpiones
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Amblypygi'        FROM `spider_traits_db`.`trait` WHERE abbrev = 'trLp';
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Pseudoscorpiones' FROM `spider_traits_db`.`trait` WHERE abbrev = 'trLp';

-- ── Opiliones ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('sule', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Scutum length',       'Length of scutum',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('scwi', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Scutum width',        'Width of scutum',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ocwi', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Ocular mound width',  'Width of ocular mound',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ochi', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Ocular mound height', 'Height of ocular mound',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Opiliones' FROM `spider_traits_db`.`trait`
  WHERE abbrev IN ('sclen', 'scwi', 'ochi');

-- ocwi: Opiliones + Uropygi
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Opiliones' FROM `spider_traits_db`.`trait` WHERE abbrev = 'ocwi';
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Uropygi'   FROM `spider_traits_db`.`trait` WHERE abbrev = 'ocwi';

-- ── Pseudoscorpiones ─────────────────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('bfeLi', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Basifemur I length',   'Length of basifemur on leg I',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tfeL1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Telofemur I length',   'Length of telofemur on leg I',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('mfeL4', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Miofemur IV length',   'Length of miofemur on leg IV',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ffile', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Fixed finger length',  'Length of fixed finger',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Pseudoscorpiones' FROM `spider_traits_db`.`trait`
  WHERE abbrev IN ('bfeLi','tfeL1','mfeL4','ffile');

-- ── Scorpiones + Pseudoscorpiones ────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('mfile', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Movable finger length', 'Length of movable finger',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Scorpiones'      FROM `spider_traits_db`.`trait` WHERE abbrev = 'mfile';
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Pseudoscorpiones' FROM `spider_traits_db`.`trait` WHERE abbrev = 'mfile';

-- ── Ricinulei ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('tr1L1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 1 I length',   'Length of trochanter 1 on leg I',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tr2L1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 2 I length',   'Length of trochanter 2 on leg I',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tr1L2', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 1 II length',  'Length of trochanter 1 on leg II',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tr2L2', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 2 II length',  'Length of trochanter 2 on leg II',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tr1L3', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 1 III length', 'Length of trochanter 1 on leg III',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tr2L3', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 2 III length', 'Length of trochanter 2 on leg III',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tr1L4', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 1 IV length',  'Length of trochanter 1 on leg IV',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('tr2L4', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Trochanter 2 IV length',  'Length of trochanter 2 on leg IV',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('cule',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Cuculus length',          'Length of cuculus',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('cuwi',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Cuculus width',           'Width of cuculus',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Ricinulei' FROM `spider_traits_db`.`trait`
  WHERE abbrev IN ('tr1L1','tr2L1','tr1L2','tr2L2','tr1L3','tr2L3','tr1L4','tr2L4','cule','cuwi');

-- ── Scorpiones ───────────────────────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('me1L', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment I length',   'Length of metasomal segment I',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me1W', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment I width',    'Width of metasomal segment I',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me2L', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment II length',  'Length of metasomal segment II',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me2W', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment II width',   'Width of metasomal segment II',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me3L', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment III length', 'Length of metasomal segment III',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me3W', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment III width',  'Width of metasomal segment III',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me4L', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment IV length',  'Length of metasomal segment IV',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me4W', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment IV width',   'Width of metasomal segment IV',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me5L', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment V length',   'Length of metasomal segment V',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('me5W', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Metasoma segment V width',    'Width of metasomal segment V',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('vele', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Vesicle length',              'Length of vesicle',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('vewi', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Vesicle width',               'Width of vesicle',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('feWp', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Femur palpal width',          'Width of femur on pedipalp',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('paWp', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Patella palpal width',        'Width of patella on pedipalp',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Scorpiones' FROM `spider_traits_db`.`trait`
  WHERE abbrev IN ('me1L','me1W','me2L','me2W','me3L','me3W',
                   'me4L','me4W','me5L','me5W','vele','vewi','feWp','paWp');

-- ── Solifugae ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('chhi', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Cheliceral height',   'Height of chelicera',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('flle', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Flagellum length',    'Length of flagellum',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('prle', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Propeltidium length', 'Length of propeltidium',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('prwi', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
           'Propeltidium width',  'Width of propeltidium',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Solifugae' FROM `spider_traits_db`.`trait`
  WHERE abbrev IN ('chhi','flle','prle','prwi');

-- ── Uropygi / Schizomida / Palpigradi ────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('fowi',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Fovea width',        'Width of fovea',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('btaL1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Basitarsus I length',  'Length of basitarsus on leg I',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('btaL4', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
            'Basitarsus IV length', 'Length of basitarsus on leg IV',
            (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

-- fowi: Uropygi only
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Uropygi'    FROM `spider_traits_db`.`trait` WHERE abbrev = 'fowi';

-- btaL1: Uropygi + Schizomida
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Uropygi'    FROM `spider_traits_db`.`trait` WHERE abbrev = 'btaL1';
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Schizomida' FROM `spider_traits_db`.`trait` WHERE abbrev = 'btaL1';

-- btaL4: Uropygi + Schizomida + Palpigradi
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Uropygi'    FROM `spider_traits_db`.`trait` WHERE abbrev = 'btaL4';
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Schizomida' FROM `spider_traits_db`.`trait` WHERE abbrev = 'btaL4';
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Palpigradi' FROM `spider_traits_db`.`trait` WHERE abbrev = 'btaL4';

-- ── Palpigradi ───────────────────────────────────────────────────────────────
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('shle',   (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Shield length',              'Dorsal shield length',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bta1Lp', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Palpal basitarsus 1 length', 'Length of basitarsus 1 on pedipalp',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bta1Wp', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Palpal basitarsus 1 width',  'Width of basitarsus 1 on pedipalp',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bta2Lp', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Palpal basitarsus 2 length', 'Length of basitarsus 2 on pedipalp',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bta2Wp', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Palpal basitarsus 2 width',  'Width of basitarsus 2 on pedipalp',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta1Lp',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Palpal tarsus 1 length',     'Length of tarsus 1 on pedipalp',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta2Lp',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Palpal tarsus 2 length',     'Length of tarsus 2 on pedipalp',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta3Lp',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Palpal tarsus 3 length',     'Length of tarsus 3 on pedipalp',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bti1L1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Basitibia 1 I length',       'Length of basitibia 1 on leg I',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bti2L1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Basitibia 2 I length',       'Length of basitibia 2 on leg I',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bti3L1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Basitibia 3 I length',       'Length of basitibia 3 on leg I',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('bti4L1', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Basitibia 4 I length',       'Length of basitibia 4 on leg I',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta1L1',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Tarsus 1 I length',          'Length of tarsus 1 on leg I',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta2L1',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Tarsus 2 I length',          'Length of tarsus 2 on leg I',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta3L1',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Tarsus 3 I length',          'Length of tarsus 3 on leg I',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta1L4',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Tarsus 1 IV length',         'Length of tarsus 1 on leg IV',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm'),
  ('ta2L4',  (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Morphometry'),
             'Tarsus 2 IV length',         'Length of tarsus 2 on leg IV',
             (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'), 'mm');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Palpigradi' FROM `spider_traits_db`.`trait`
  WHERE abbrev IN ('shle','bta1Lp','bta1Wp','bta2Lp','bta2Wp',
                   'ta1Lp','ta2Lp','ta3Lp',
                   'bti1L1','bti2L1','bti3L1','bti4L1',
                   'ta1L1','ta2L1','ta3L1','ta1L4','ta2L4');

-- bta1Lp: Schizomida + Palpigradi (already inserted for Palpigradi above)
INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT id, 'Schizomida' FROM `spider_traits_db`.`trait` WHERE abbrev = 'bta1Lp';

-- ── Traits applicable to ALL arachnid orders ─────────────────────────────────
-- ltel / utel are distinct from the existing pytl / pytu (different methodology).
INSERT IGNORE INTO `spider_traits_db`.`trait`
    (`abbrev`, `trait_category_id`, `name`, `description`, `data_type_id`, `standard`)
  VALUES
  ('ltel', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Physiology'),
           'Lower thermal limit (LT50)',
           'Lower temperature at which 50% of population (LT50) survived',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'),
           'degree Celsius'),
  ('utel', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Physiology'),
           'Upper thermal limit (LT50)',
           'Upper temperature at which 50% of population (LT50) survived',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'),
           'degree Celsius'),
  ('ncan', (SELECT id FROM `spider_traits_db`.`trait_category` WHERE name = 'Predation'),
           'Non-sexual cannibalism',
           'Relative frequency of non-sexual cannibalism (in juveniles, between juveniles and adults)',
           (SELECT id FROM `spider_traits_db`.`data_type` WHERE UPPER(name) = 'REAL NUMBER'),
           '');

INSERT IGNORE INTO `spider_traits_db`.`trait_order` (`trait_id`, `order_id`)
  SELECT t.`id`, o.`id`
  FROM `spider_traits_db`.`trait` t
  CROSS JOIN `spider_traits_db`.`order` o
  WHERE t.`abbrev` IN ('ltel','utel','ncan');

-- =============================================================================

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
