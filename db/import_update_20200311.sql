-- MySQL Workbench Synchronization
-- Generated: 2020-03-11 10:22
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: adamk

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

ALTER TABLE `spider_traits_db`.`data` 
ADD COLUMN `event_date_text` VARCHAR(255) NULL DEFAULT NULL COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).\n' AFTER `sample_size`,
ADD INDEX `row_link_idx` (`row_link` ASC),
ADD INDEX `event_date_start_idx` (`event_date_start` ASC),
ADD INDEX `event_date_end_idx` (`event_date_end` ASC),
ADD INDEX `event_date_text_idx` (`event_date_text` ASC);

ALTER TABLE `spider_traits_db`.`dataset` 
ADD COLUMN `authors_email` VARCHAR(255) NULL DEFAULT NULL AFTER `email`,
ADD COLUMN `message` VARCHAR(4096) NULL DEFAULT NULL AFTER `sub`,
ADD INDEX `authors_idx` (`authors` ASC),
ADD INDEX `imported_idx` (`imported` ASC),
ADD INDEX `sub_idx` (`sub` ASC);

ALTER TABLE `spider_traits_db`.`taxonomy` 
ADD INDEX `family_idx` (`family` ASC),
ADD INDEX `genus_idx` (`genus` ASC),
ADD INDEX `taxon_idx` (`genus` ASC, `species` ASC, `subspecies` ASC);

ALTER TABLE `spider_traits_db`.`location` 
CHANGE COLUMN `locality` `locality` VARCHAR(255) NULL DEFAULT NULL COMMENT 'The original textual description of the place. (e.g. Municipality of Helsinki; small hill close to the river; Mount Fuji)' ,
ADD INDEX `locality_idx` (`locality` ASC);

ALTER TABLE `spider_traits_db`.`import` 
CHANGE COLUMN `reference` `reference` VARCHAR(4096) NULL DEFAULT NULL ,
CHANGE COLUMN `location_locality` `location_locality` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `habitat_global_id` `location_habitat_global_id` INT(11) NULL DEFAULT NULL ,
CHANGE COLUMN `country_id` `location_country_id` INT(11) NULL DEFAULT NULL ,
ADD COLUMN `reference_abbrev` VARCHAR(45) NULL DEFAULT NULL AFTER `reference`,
ADD COLUMN `location_abbrev` VARCHAR(45) NULL DEFAULT NULL AFTER `reference_doi`,
ADD COLUMN `taxonomy_id` INT(11) NULL DEFAULT NULL AFTER `location_note`,
ADD COLUMN `value_numeric` DECIMAL(15,4) NULL DEFAULT NULL AFTER `event_date_end`,
ADD COLUMN `frequency_numeric` DECIMAL(9,4) NULL DEFAULT NULL AFTER `value_numeric`,
ADD COLUMN `sample_size_numeric` INT(11) NULL DEFAULT NULL AFTER `frequency_numeric`,
ADD COLUMN `location_lat_conv` DECIMAL(11,8) NULL DEFAULT NULL AFTER `sample_size_numeric`,
ADD COLUMN `location_lon_conv` DECIMAL(11,8) NULL DEFAULT NULL AFTER `location_lat_conv`,
ADD COLUMN `changed` TINYINT(1) NOT NULL AFTER `location_lon_conv`,
ADD COLUMN `valid` TINYINT(1) NOT NULL AFTER `changed`,
ADD COLUMN `valid_review` TINYINT(1) NOT NULL AFTER `valid`,
ADD INDEX `import_valid_idx` (`valid` ASC),
ADD INDEX `import_valid_review_idx` (`valid_review` ASC),
ADD INDEX `import_changed_idx` (`changed` ASC),
ADD INDEX `import_original_name_idx` (`original_name` ASC),
ADD INDEX `import_wsc_lsid_idx` (`wsc_lsid` ASC),
ADD INDEX `import_trait_abbrev_idx` (`trait_abbrev` ASC),
ADD INDEX `import_trait_name_idx` (`trait_name` ASC),
ADD INDEX `import_value_idx` (`value` ASC),
ADD INDEX `import_measure_idx` (`measure` ASC),
ADD INDEX `import_sex_idx` (`sex` ASC),
ADD INDEX `import_life_stage_idx` (`life_stage` ASC),
ADD INDEX `import_event_date_idx` (`event_date` ASC),
ADD INDEX `import_row_link` (`row_link` ASC),
ADD INDEX `import_method_abbrev_idx` (`method_abbrev` ASC),
ADD INDEX `import_method_name_idx` (`method_name` ASC),
ADD INDEX `import_refrence_abbrev_idx` (`reference_abbrev` ASC),
ADD INDEX `import_reference_idx` (`reference` ASC),
ADD INDEX `import_reference_doi_idx` (`reference_doi` ASC),
ADD INDEX `import_location_abbrev_idx` (`location_abbrev` ASC),
ADD INDEX `import_location_lat_idx` (`location_lat` ASC),
ADD INDEX `import_location_lon_idx` (`location_lon` ASC),
ADD INDEX `import_location_hg_idx` (`location_habitat_global` ASC),
ADD INDEX `import_location_cc_idx` (`location_country_code` ASC);

ALTER TABLE `spider_traits_db`.`country` 
ADD INDEX `alpha3_code_idx` (`alpha3_code` ASC),
ADD INDEX `name_idx` (`name` ASC),
ADD INDEX `code_name_idx` (`alpha3_code` ASC, `name` ASC);

ALTER TABLE `spider_traits_db`.`import` 
DROP FOREIGN KEY `import_habitat_global_fk`,
DROP FOREIGN KEY `import_country_fk`;

ALTER TABLE `spider_traits_db`.`import` ADD CONSTRAINT `import_habitat_global_fk`
  FOREIGN KEY (`location_habitat_global_id`)
  REFERENCES `spider_traits_db`.`habitat_global` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `import_country_fk`
  FOREIGN KEY (`location_country_id`)
  REFERENCES `spider_traits_db`.`country` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
