-- MySQL Workbench Synchronization
-- Generated: 2020-12-10 14:05
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: adamk

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

ALTER TABLE `spider_traits_db`.`data` 
ADD COLUMN `altitude` INT(11) NULL DEFAULT NULL COMMENT 'Altitude above the sea level in meters. (e.g. 700, 3462, etc.)' AFTER `event_date_end`,
ADD COLUMN `locality` VARCHAR(255) NULL DEFAULT NULL COMMENT 'The original textual description of the place. (e.g. Municipality of Helsinki; small hill close to the river; Mount Fuji)' AFTER `altitude`,
ADD COLUMN `country_id` INT(11) NULL DEFAULT NULL COMMENT 'The standard code for the country. (e.g. CZ, IT, BR, etc.)' AFTER `locality`,
ADD COLUMN `habitat` TEXT NULL DEFAULT NULL COMMENT 'Verbatim description of the habitat (e.g. forest, grassland, cave, CORINE habitat code, etc.)' AFTER `country_id`,
ADD COLUMN `microhabitat` TEXT NULL DEFAULT NULL COMMENT 'Verbatim description of the microhabitat (e.g. under stones, ground, canopy, etc.)' AFTER `habitat`;

ALTER TABLE `spider_traits_db`.`taxonomy` 
ADD COLUMN `order` VARCHAR(255) NULL DEFAULT NULL AFTER `wsc_lsid`,
ADD INDEX `order_idx` (`order` ASC);
;

ALTER TABLE `spider_traits_db`.`import` 
DROP COLUMN `location_note`,
DROP COLUMN `location_stratum`,
DROP COLUMN `location_habitat_global`,
ADD COLUMN `taxonomy_order` VARCHAR(255) NULL DEFAULT NULL AFTER `original_name`,
ADD COLUMN `taxonomy_family` VARCHAR(255) NULL DEFAULT NULL AFTER `taxonomy_order`,
ADD COLUMN `taxonomy_genus` VARCHAR(255) NULL DEFAULT NULL AFTER `taxonomy_family`,
ADD COLUMN `taxonomy_species` VARCHAR(255) NULL DEFAULT NULL AFTER `taxonomy_genus`,
ADD COLUMN `taxonomy_subspecies` VARCHAR(255) NULL DEFAULT NULL AFTER `taxonomy_species`,
CHANGE COLUMN `location_altitude` `altitude` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `location_locality` `locality` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `location_country_code` `country_code` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `location_habitat` `habitat` TEXT NULL DEFAULT NULL ,
CHANGE COLUMN `location_microhabitat` `microhabitat` TEXT NULL DEFAULT NULL ,
CHANGE COLUMN `location_country_id` `country_id` INT(11) NULL DEFAULT NULL,
CHANGE COLUMN `location_altitude_numeric` `altitude_numeric` INT(11) NULL DEFAULT NULL AFTER `sample_size_numeric`,
DROP INDEX `import_location_cc_idx` ,
ADD INDEX `import_country_idx` (`country_code` ASC),
DROP INDEX `import_location_hg_idx` ;
;

ALTER TABLE `spider_traits_db`.`import` 
DROP FOREIGN KEY `import_country_fk`;

ALTER TABLE `spider_traits_db`.`import` ADD CONSTRAINT `import_country_fk`
  FOREIGN KEY (`country_id`)
  REFERENCES `spider_traits_db`.`country` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
