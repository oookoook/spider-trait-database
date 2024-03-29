-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema spider_traits_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema spider_traits_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `spider_traits_db` DEFAULT CHARACTER SET utf8 ;
USE `spider_traits_db` ;

-- -----------------------------------------------------
-- Table `spider_traits_db`.`taxonomy`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`taxonomy` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`taxonomy` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `wsc_lsid` VARCHAR(45) NULL,
  `order` VARCHAR(255) NULL,
  `family` VARCHAR(255) NULL,
  `genus` VARCHAR(255) NULL,
  `species` VARCHAR(255) NULL,
  `subspecies` VARCHAR(255) NULL,
  `author` VARCHAR(255) NULL,
  `year` INT NULL,
  `valid` TINYINT(1) NOT NULL,
  `valid_wsc_lsid` VARCHAR(45) NULL,
  `valid_id` INT NULL,
  `full_name` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `family_idx` (`family` ASC) VISIBLE,
  INDEX `genus_idx` (`genus` ASC) VISIBLE,
  INDEX `taxon_idx` (`genus` ASC, `species` ASC, `subspecies` ASC) VISIBLE,
  INDEX `wsclsid_idx` (`wsc_lsid` ASC) VISIBLE,
  INDEX `valid_idx` (`valid` ASC) VISIBLE,
  INDEX `full_name_idx` (`full_name` ASC) VISIBLE,
  INDEX `taxonomy_valid_id_idx` (`valid_id` ASC) VISIBLE,
  INDEX `order_idx` (`order` ASC) VISIBLE,
  CONSTRAINT `taxonomy_valid_id`
    FOREIGN KEY (`valid_id`)
    REFERENCES `spider_traits_db`.`taxonomy` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`trait_category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`trait_category` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`trait_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`data_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`data_type` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`data_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`reference`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`reference` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`reference` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `doi` VARCHAR(255) NULL,
  `full_citation` VARCHAR(1024) NOT NULL,
  `abbrev` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC) VISIBLE,
  INDEX `full_citation_idx` (`full_citation`(100) ASC) VISIBLE,
  INDEX `doi_idx` (`doi` ASC) VISIBLE,
  INDEX `all_idx` (`abbrev` ASC, `full_citation`(100) ASC, `doi` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`trait`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`trait` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`trait` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `abbrev` VARCHAR(45) NOT NULL,
  `trait_category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `data_type_id` INT NOT NULL,
  `standard` TEXT NULL,
  `reference_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `trait_trait_category_fk_idx` (`trait_category_id` ASC) VISIBLE,
  INDEX `trait_data_type_fk_idx` (`data_type_id` ASC) VISIBLE,
  INDEX `trait_reference_fk_idx` (`reference_id` ASC) VISIBLE,
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC) VISIBLE,
  CONSTRAINT `trait_trait_category_fk`
    FOREIGN KEY (`trait_category_id`)
    REFERENCES `spider_traits_db`.`trait_category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `trait_data_type_fk`
    FOREIGN KEY (`data_type_id`)
    REFERENCES `spider_traits_db`.`data_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `trait_reference_fk`
    FOREIGN KEY (`reference_id`)
    REFERENCES `spider_traits_db`.`reference` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`measure`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`measure` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`measure` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL COMMENT 'valid categories: single observation; mean; median; min; max',
  PRIMARY KEY (`id`),
  INDEX `name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`sex`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`sex` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`sex` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL COMMENT 'Categorical variable; female, male; both; unknown',
  PRIMARY KEY (`id`),
  INDEX `name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`life_stage`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`life_stage` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`life_stage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL COMMENT 'Categorical variable. One of: egg, spiderling, juvenile, adult, all',
  PRIMARY KEY (`id`),
  INDEX `name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`method`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`method` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`method` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `abbrev` VARCHAR(45) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `reference_id` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC) VISIBLE,
  INDEX `reference_fk_idx` (`reference_id` ASC) VISIBLE,
  CONSTRAINT `method_reference_fk`
    FOREIGN KEY (`reference_id`)
    REFERENCES `spider_traits_db`.`reference` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`habitat_global`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`habitat_global` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`habitat_global` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(255) NULL,
  `name` VARCHAR(255) NOT NULL,
  `number` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `name_idx` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`country`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`country` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`country` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `alpha2_code` VARCHAR(5) NOT NULL,
  `alpha3_code` VARCHAR(5) NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `alpha3_code_idx` (`alpha3_code` ASC) VISIBLE,
  INDEX `name_idx` (`name` ASC) VISIBLE,
  INDEX `code_name_idx` (`alpha3_code` ASC, `name` ASC) VISIBLE,
  INDEX `alpha2_code_idx` (`alpha2_code` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`location`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`location` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`location` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `abbrev` VARCHAR(45) NOT NULL,
  `lat` DECIMAL(11,8) NULL COMMENT 'The geographic latitude (in decimal degrees, using the spatial reference system WGS84) of the geographic center of a Location. Positive values are north of the Equator, negative values are south of it. Legal values lie between -90 and 90, inclusive (e.g. 45.74, -37.22285; etc.)',
  `lon` DECIMAL(11,8) NULL COMMENT 'The geographic longitude (in decimal degrees, using the spatial reference system WGS84) of the geographic center of a Location. Positive values are east of the Greenwich Meridian, negative values are west of it. Legal values lie between -180 and 180, inclusive. (e.g. 102.478922; -0.4767; etc.)',
  `precision` DECIMAL(11,8) NULL COMMENT 'A decimal representation of the precision of the coordinates given in the decimalLatitude and decimalLongitude.',
  `altitude` INT NULL COMMENT 'Altitude above the sea level in meters. (e.g. 700, 3462, etc.)',
  `locality` VARCHAR(255) NULL COMMENT 'The original textual description of the place. (e.g. Municipality of Helsinki; small hill close to the river; Mount Fuji)',
  `country_id` INT NULL COMMENT 'The standard code for the country. (e.g. CZ, IT, BR, etc.)',
  `habitat_global_id` INT NULL COMMENT 'A description of the global habitat based on IUCN habitats – https://www.iucnredlist.org/resources/habitat-classification-scheme (e.g. Savanna - Dry; Forest, etc.)',
  `habitat` TEXT NULL COMMENT 'Verbatim description of the habitat (e.g. forest, grassland, cave, CORINE habitat code, etc.)',
  `microhabitat` TEXT NULL COMMENT 'Verbatim description of the microhabitat (e.g. under stones, ground, canopy, etc.)',
  `stratum` TEXT NULL COMMENT 'Verbatim description of the stratum. (ex. subterranean, epigean, under water, arboreal, index of verticality, etc.)',
  `note` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `habitat_global_fk_idx` (`habitat_global_id` ASC) VISIBLE,
  INDEX `location_country_fk_idx` (`country_id` ASC) VISIBLE,
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC) VISIBLE,
  INDEX `locality_idx` (`locality` ASC) VISIBLE,
  INDEX `coords_idx` (`lat` ASC, `lon` ASC) VISIBLE,
  CONSTRAINT `location_habitat_global_fk`
    FOREIGN KEY (`habitat_global_id`)
    REFERENCES `spider_traits_db`.`habitat_global` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `location_country_fk`
    FOREIGN KEY (`country_id`)
    REFERENCES `spider_traits_db`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`dataset`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`dataset` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`dataset` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `authors` VARCHAR(1024) NULL,
  `uploader` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `authors_email` VARCHAR(255) NULL,
  `doi` VARCHAR(45) NULL,
  `orcid` VARCHAR(45) NULL,
  `date` DATETIME NOT NULL,
  `notes` TEXT NULL,
  `imported` TINYINT(1) NOT NULL,
  `sub` VARCHAR(45) NOT NULL,
  `message` VARCHAR(4096) NULL,
  `records` INT NOT NULL DEFAULT 0,
  `source_file` VARCHAR(512) NULL,
  `restricted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `authors_idx` (`authors`(100) ASC) VISIBLE,
  INDEX `imported_idx` (`imported` ASC) VISIBLE,
  INDEX `sub_idx` (`sub` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`data`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`data` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `taxonomy_id` INT NOT NULL COMMENT 'Taxonomic identifier linking with World Spider Catalog',
  `original_name` VARCHAR(255) NOT NULL COMMENT 'Full taxon name as assigned by the author in the original source (that is, not changed based on later taxonomical amendations). (ex. Pimoa rupicola)',
  `trait_id` INT NOT NULL COMMENT 'unique identifier linking to trait table',
  `value` VARCHAR(255) NULL COMMENT 'trait value',
  `value_numeric` DECIMAL(15,4) NULL,
  `measure_id` INT NOT NULL COMMENT 'valid categories: single observation; mean; median; min; max',
  `sex_id` INT NULL COMMENT 'Categorical variable; female, male; both; unknown',
  `life_stage_id` INT NULL COMMENT 'Categorical variable. One of: egg, spiderling, juvenile, adult, all',
  `frequency` DECIMAL(9,4) NULL COMMENT 'Real number. Relative frequency of occurrence. ',
  `sample_size` INT NULL COMMENT 'Integer. Total number of observation per record.',
  `treatment` VARCHAR(255) NULL,
  `event_date_text` VARCHAR(255) NULL COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).',
  `event_date_start` DATETIME NULL COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).',
  `event_date_end` DATETIME NULL COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).',
  `altitude` INT NULL COMMENT 'Altitude above the sea level in meters. (e.g. 700, 3462, etc.)',
  `locality` VARCHAR(255) NULL COMMENT 'The original textual description of the place. (e.g. Municipality of Helsinki; small hill close to the river; Mount Fuji)',
  `country_id` INT NULL COMMENT 'The standard code for the country. (e.g. CZ, IT, BR, etc.)',
  `habitat` TEXT NULL COMMENT 'Verbatim description of the habitat (e.g. forest, grassland, cave, CORINE habitat code, etc.)',
  `microhabitat` TEXT NULL COMMENT 'Verbatim description of the microhabitat (e.g. under stones, ground, canopy, etc.)',
  `note` TEXT NULL,
  `row_link` INT NULL COMMENT 'for multidimensional data, i.e. use same numbers for rows that contain data from same individuals or populations obtained in the same context',
  `method_id` INT NULL COMMENT 'unique identifier linking to Methods table',
  `location_id` INT NULL COMMENT 'unique identifier linking to Location table',
  `dataset_id` INT NOT NULL,
  `reference_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `taxonomy_idx` (`taxonomy_id` ASC) VISIBLE,
  INDEX `trait_idx` (`trait_id` ASC) VISIBLE,
  INDEX `measure_idx` (`measure_id` ASC) VISIBLE,
  INDEX `sex_idx` (`sex_id` ASC) VISIBLE,
  INDEX `life_stage_idx` (`life_stage_id` ASC) VISIBLE,
  INDEX `method_idx` (`method_id` ASC) VISIBLE,
  INDEX `dataset_fk_idx` (`dataset_id` ASC) VISIBLE,
  INDEX `reference_fk_idx` (`reference_id` ASC) VISIBLE,
  INDEX `data_location_fk_idx` (`location_id` ASC) VISIBLE,
  INDEX `row_link_idx` (`row_link` ASC) VISIBLE,
  INDEX `event_date_start_idx` (`event_date_start` ASC) VISIBLE,
  INDEX `event_date_end_idx` (`event_date_end` ASC) VISIBLE,
  INDEX `event_date_text_idx` (`event_date_text` ASC) VISIBLE,
  CONSTRAINT `data_taxonomy_fk`
    FOREIGN KEY (`taxonomy_id`)
    REFERENCES `spider_traits_db`.`taxonomy` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_trait_fk`
    FOREIGN KEY (`trait_id`)
    REFERENCES `spider_traits_db`.`trait` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_measure_fk`
    FOREIGN KEY (`measure_id`)
    REFERENCES `spider_traits_db`.`measure` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_sex_fk`
    FOREIGN KEY (`sex_id`)
    REFERENCES `spider_traits_db`.`sex` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_life_stage_fk`
    FOREIGN KEY (`life_stage_id`)
    REFERENCES `spider_traits_db`.`life_stage` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_method_fk`
    FOREIGN KEY (`method_id`)
    REFERENCES `spider_traits_db`.`method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_location_fk`
    FOREIGN KEY (`location_id`)
    REFERENCES `spider_traits_db`.`location` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_dataset_fk`
    FOREIGN KEY (`dataset_id`)
    REFERENCES `spider_traits_db`.`dataset` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `data_reference_fk`
    FOREIGN KEY (`reference_id`)
    REFERENCES `spider_traits_db`.`reference` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`taxonomy_name`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`taxonomy_name` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`taxonomy_name` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `taxonomy_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `valid` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `taxonomy_name_taxonomy_fk_idx` (`taxonomy_id` ASC) VISIBLE,
  INDEX `name_idx` (`name` ASC) VISIBLE,
  CONSTRAINT `taxonomy_name_taxonomy_fk`
    FOREIGN KEY (`taxonomy_id`)
    REFERENCES `spider_traits_db`.`taxonomy` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`import`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`import` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`import` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dataset_id` INT NOT NULL,
  `wsc_lsid` VARCHAR(45) NULL,
  `original_name` VARCHAR(255) NULL,
  `taxonomy_order` VARCHAR(255) NULL,
  `taxonomy_family` VARCHAR(255) NULL,
  `taxonomy_taxon` VARCHAR(255) NULL,
  `trait_abbrev` VARCHAR(45) NULL,
  `trait_name` VARCHAR(255) NULL,
  `trait_description` TEXT NULL,
  `trait_data_type` VARCHAR(45) NULL,
  `trait_category` VARCHAR(45) NULL,
  `value` VARCHAR(255) NULL,
  `measure` VARCHAR(45) NULL,
  `sex` VARCHAR(45) NULL,
  `life_stage` VARCHAR(45) NULL,
  `frequency` VARCHAR(45) NULL,
  `sample_size` VARCHAR(45) NULL,
  `treatment` VARCHAR(255) NULL,
  `event_date` VARCHAR(45) NULL,
  `note` TEXT NULL,
  `row_link` VARCHAR(45) NULL,
  `method_abbrev` VARCHAR(45) NULL,
  `method_name` VARCHAR(255) NULL,
  `method_description` TEXT NULL,
  `reference` VARCHAR(1024) NULL,
  `reference_abbrev` VARCHAR(255) NULL,
  `reference_doi` VARCHAR(255) NULL,
  `location_abbrev` VARCHAR(45) NULL,
  `location_lat` VARCHAR(45) NULL,
  `location_lon` VARCHAR(45) NULL,
  `location_precision` VARCHAR(45) NULL,
  `altitude` VARCHAR(45) NULL,
  `locality` VARCHAR(255) NULL,
  `country_code` VARCHAR(45) NULL,
  `habitat` TEXT NULL,
  `microhabitat` TEXT NULL,
  `taxonomy_id` INT NULL,
  `sex_id` INT NULL,
  `life_stage_id` INT NULL,
  `measure_id` INT NULL,
  `method_id` INT NULL,
  `trait_id` INT NULL,
  `trait_data_type_id` INT NULL,
  `trait_category_id` INT NULL,
  `reference_id` INT NULL,
  `location_id` INT NULL,
  `location_habitat_global_id` INT NULL,
  `country_id` INT NULL,
  `event_date_start` DATETIME NULL,
  `event_date_end` DATETIME NULL,
  `value_numeric` DECIMAL(15,4) NULL,
  `frequency_numeric` DECIMAL(9,4) NULL,
  `sample_size_numeric` INT NULL,
  `altitude_numeric` INT NULL,
  `location_lat_conv` DECIMAL(11,8) NULL,
  `location_lon_conv` DECIMAL(11,8) NULL,
  `location_precision_numeric` DECIMAL(11,8) NULL,
  `require_numeric_value` TINYINT(1) NULL,
  `changed` TINYINT(1) NOT NULL,
  `valid` TINYINT(1) NOT NULL,
  `valid_review` TINYINT(1) NOT NULL,
  `duplicate` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `import_dataset_fk_idx` (`dataset_id` ASC) VISIBLE,
  INDEX `import_sex_fk_idx` (`sex_id` ASC) VISIBLE,
  INDEX `import_measure_fk_idx` (`measure_id` ASC) VISIBLE,
  INDEX `import_method_fk_idx` (`method_id` ASC) VISIBLE,
  INDEX `import_trait_kf_idx` (`trait_id` ASC) VISIBLE,
  INDEX `import_reference_fk_idx` (`reference_id` ASC) VISIBLE,
  INDEX `import_location_fk_idx` (`location_id` ASC) VISIBLE,
  INDEX `import_habitat_global_fk_idx` (`location_habitat_global_id` ASC) VISIBLE,
  INDEX `import_country_fk_idx` (`country_id` ASC) VISIBLE,
  INDEX `import_life_stage_fk_idx` (`life_stage_id` ASC) VISIBLE,
  INDEX `import_valid_idx` (`valid` ASC) VISIBLE,
  INDEX `import_valid_review_idx` (`valid_review` ASC) VISIBLE,
  INDEX `import_changed_idx` (`changed` ASC) VISIBLE,
  INDEX `import_original_name_idx` (`original_name` ASC) VISIBLE,
  INDEX `import_wsc_lsid_idx` (`wsc_lsid` ASC) VISIBLE,
  INDEX `import_trait_abbrev_idx` (`trait_abbrev` ASC) VISIBLE,
  INDEX `import_trait_name_idx` (`trait_name` ASC) VISIBLE,
  INDEX `import_value_idx` (`value` ASC) VISIBLE,
  INDEX `import_measure_idx` (`measure` ASC) VISIBLE,
  INDEX `import_sex_idx` (`sex` ASC) VISIBLE,
  INDEX `import_life_stage_idx` (`life_stage` ASC) VISIBLE,
  INDEX `import_event_date_idx` (`event_date` ASC) VISIBLE,
  INDEX `import_row_link` (`row_link` ASC) VISIBLE,
  INDEX `import_method_abbrev_idx` (`method_abbrev` ASC) VISIBLE,
  INDEX `import_method_name_idx` (`method_name` ASC) VISIBLE,
  INDEX `import_refrence_abbrev_idx` (`reference_abbrev` ASC) VISIBLE,
  INDEX `import_reference_idx` (`reference`(100) ASC) VISIBLE,
  INDEX `import_reference_doi_idx` (`reference_doi` ASC) VISIBLE,
  INDEX `import_location_abbrev_idx` (`location_abbrev` ASC) VISIBLE,
  INDEX `import_location_lat_idx` (`location_lat` ASC) VISIBLE,
  INDEX `import_location_lon_idx` (`location_lon` ASC) VISIBLE,
  INDEX `import_country_idx` (`country_code` ASC) VISIBLE,
  CONSTRAINT `import_dataset_fk`
    FOREIGN KEY (`dataset_id`)
    REFERENCES `spider_traits_db`.`dataset` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_sex_fk`
    FOREIGN KEY (`sex_id`)
    REFERENCES `spider_traits_db`.`sex` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_life_stage_fk`
    FOREIGN KEY (`life_stage_id`)
    REFERENCES `spider_traits_db`.`life_stage` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_measure_fk`
    FOREIGN KEY (`measure_id`)
    REFERENCES `spider_traits_db`.`measure` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_method_fk`
    FOREIGN KEY (`method_id`)
    REFERENCES `spider_traits_db`.`method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_trait_kf`
    FOREIGN KEY (`trait_id`)
    REFERENCES `spider_traits_db`.`trait` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_reference_fk`
    FOREIGN KEY (`reference_id`)
    REFERENCES `spider_traits_db`.`reference` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_location_fk`
    FOREIGN KEY (`location_id`)
    REFERENCES `spider_traits_db`.`location` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_habitat_global_fk`
    FOREIGN KEY (`location_habitat_global_id`)
    REFERENCES `spider_traits_db`.`habitat_global` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `import_country_fk`
    FOREIGN KEY (`country_id`)
    REFERENCES `spider_traits_db`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE = '';
GRANT USAGE ON *.* TO app;
 DROP USER app;
SET SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
CREATE USER 'app' IDENTIFIED BY 'app';

GRANT SELECT, INSERT, TRIGGER ON TABLE `spider_traits_db`.* TO 'app';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `spider_traits_db`.* TO 'app';
GRANT SELECT ON TABLE `spider_traits_db`.* TO 'app';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
