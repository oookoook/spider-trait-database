-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema spider_traits_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema spider_traits_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `spider_traits_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `spider_traits_db` ;

-- -----------------------------------------------------
-- Table `spider_traits_db`.`reference`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`reference` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`reference` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `doi` VARCHAR(255) NULL,
  `full_citation` VARCHAR(4096) NULL,
  `abbrev` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`taxonomy`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`taxonomy` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`taxonomy` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `wsc_lsid` VARCHAR(45) NOT NULL,
  `wsc_id` INT NOT NULL,
  `family` VARCHAR(255) NULL,
  `genus` VARCHAR(255) NULL,
  `species` VARCHAR(255) NULL,
  `subspecies` VARCHAR(255) NULL,
  `author` VARCHAR(255) NULL,
  `year` INT NULL,
  `reference_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `taxonomy_reference_fk_idx` (`reference_id` ASC),
  INDEX `family_idx` (`family` ASC),
  INDEX `genus_idx` (`genus` ASC),
  INDEX `taxon_idx` (`genus` ASC, `species` ASC, `subspecies` ASC),
  CONSTRAINT `taxonomy_reference_fk`
    FOREIGN KEY (`reference_id`)
    REFERENCES `spider_traits_db`.`reference` (`id`)
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
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`data_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`data_type` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`data_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
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
  INDEX `trait_trait_category_fk_idx` (`trait_category_id` ASC),
  INDEX `trait_data_type_fk_idx` (`data_type_id` ASC),
  INDEX `trait_reference_fk_idx` (`reference_id` ASC),
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC),
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
  `name` VARCHAR(45) NOT NULL COMMENT 'valid categories: single observation; mean; median; min; max\n',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`sex`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`sex` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`sex` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL COMMENT 'Categorical variable; female, male; both; unknown\n',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`life_stage`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`life_stage` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`life_stage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL COMMENT 'Categorical variable. One of: egg, spiderling, juvenile, adult, all\n',
  PRIMARY KEY (`id`))
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
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC),
  INDEX `reference_fk_idx` (`reference_id` ASC),
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
  PRIMARY KEY (`id`))
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
  INDEX `alpha3_code_idx` (`alpha3_code` ASC),
  INDEX `name_idx` (`name` ASC),
  INDEX `code_name_idx` (`alpha3_code` ASC, `name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`location`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`location` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`location` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `abbrev` VARCHAR(45) NOT NULL,
  `lat` DECIMAL(11,8) NULL COMMENT 'The geographic latitude (in decimal degrees, using the spatial reference system WGS84) of the geographic center of a Location. Positive values are north of the Equator, negative values are south of it. Legal values lie between -90 and 90, inclusive (e.g. 45.74, -37.22285; etc.)',
  `lon` DECIMAL(11,8) NULL COMMENT 'The geographic longitude (in decimal degrees, using the spatial reference system WGS84) of the geographic center of a Location. Positive values are east of the Greenwich Meridian, negative values are west of it. Legal values lie between -180 and 180, inclusive. (e.g. 102.478922; -0.4767; etc.)\n',
  `precision` DECIMAL(11,8) NULL COMMENT 'A decimal representation of the precision of the coordinates given in the decimalLatitude and decimalLongitude.',
  `altitude` INT NULL COMMENT 'Altitude above the sea level in meters. (e.g. 700, 3462, etc.)',
  `locality` VARCHAR(255) NULL COMMENT 'The original textual description of the place. (e.g. Municipality of Helsinki; small hill close to the river; Mount Fuji)',
  `country_id` INT NULL COMMENT 'The standard code for the country. (e.g. CZ, IT, BR, etc.)',
  `habitat_global_id` INT NULL COMMENT 'A description of the global habitat based on IUCN habitats – https://www.iucnredlist.org/resources/habitat-classification-scheme (e.g. Savanna - Dry; Forest, etc.)',
  `habitat` TEXT NULL COMMENT 'Verbatim description of the habitat (e.g. forest, grassland, cave, CORINE habitat code, etc.)\n',
  `microhabitat` TEXT NULL COMMENT 'Verbatim description of the microhabitat (e.g. under stones, ground, canopy, etc.)\n',
  `stratum` TEXT NULL COMMENT 'Verbatim description of the stratum. (ex. subterranean, epigean, under water, arboreal, index of verticality, etc.)\n',
  `note` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `habitat_global_fk_idx` (`habitat_global_id` ASC),
  INDEX `location_country_fk_idx` (`country_id` ASC),
  UNIQUE INDEX `abbrev_UNIQUE` (`abbrev` ASC),
  INDEX `locality_idx` (`locality` ASC),
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
  `authors` VARCHAR(4096) NULL,
  `uploader` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `authors_email` VARCHAR(255) NULL,
  `date` DATETIME NOT NULL,
  `notes` TEXT NULL,
  `imported` TINYINT(1) NOT NULL,
  `sub` VARCHAR(45) NOT NULL,
  `message` VARCHAR(4096) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  INDEX `authors_idx` (`authors` ASC),
  INDEX `imported_idx` (`imported` ASC),
  INDEX `sub_idx` (`sub` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spider_traits_db`.`data`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spider_traits_db`.`data` ;

CREATE TABLE IF NOT EXISTS `spider_traits_db`.`data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `taxonomy_id` INT NOT NULL COMMENT 'Taxonomic identifier linking with World Spider Catalog\n',
  `original_name` VARCHAR(255) NOT NULL COMMENT 'Full taxon name as assigned by the author in the original source (that is, not changed based on later taxonomical amendations). (ex. Pimoa rupicola)',
  `trait_id` INT NOT NULL COMMENT 'unique identifier linking to trait table\n',
  `value` VARCHAR(45) NULL COMMENT 'trait value\n',
  `value_numeric` DECIMAL(15,4) NULL,
  `measure_id` INT NOT NULL COMMENT 'valid categories: single observation; mean; median; min; max\n',
  `sex_id` INT NULL COMMENT 'Categorical variable; female, male; both; unknown\n',
  `life_stage_id` INT NULL COMMENT 'Categorical variable. One of: egg, spiderling, juvenile, adult, all\n',
  `frequency` DECIMAL(9,4) NULL COMMENT 'Real number. Relative frequency of occurrence. \n',
  `sample_size` INT NULL COMMENT 'Integer. Total number of observation per record.\n',
  `event_date_text` VARCHAR(255) NULL COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).\n',
  `event_date_start` DATETIME NULL COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).\n',
  `event_date_end` DATETIME NULL COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).\n',
  `row_link` INT NULL COMMENT 'for multidimensional data, i.e. use same numbers for rows that contain data from same individuals or populations obtained in the same context\n',
  `method_id` INT NOT NULL COMMENT 'unique identifier linking to Methods table\n',
  `location_id` INT NULL COMMENT 'unique identifier linking to Location table\n',
  `dataset_id` INT NOT NULL,
  `reference_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `taxonomy_idx` (`taxonomy_id` ASC),
  INDEX `trait_idx` (`trait_id` ASC),
  INDEX `measure_idx` (`measure_id` ASC),
  INDEX `sex_idx` (`sex_id` ASC),
  INDEX `life_stage_idx` (`life_stage_id` ASC),
  INDEX `method_idx` (`method_id` ASC),
  INDEX `dataset_fk_idx` (`dataset_id` ASC),
  INDEX `reference_fk_idx` (`reference_id` ASC),
  INDEX `data_location_fk_idx` (`location_id` ASC),
  INDEX `row_link_idx` (`row_link` ASC),
  INDEX `event_date_start_idx` (`event_date_start` ASC),
  INDEX `event_date_end_idx` (`event_date_end` ASC),
  INDEX `event_date_text_idx` (`event_date_text` ASC),
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
  INDEX `taxonomy_name_taxonomy_fk_idx` (`taxonomy_id` ASC),
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
  `trait_abbrev` VARCHAR(45) NULL,
  `trait_name` VARCHAR(255) NULL,
  `trait_description` TEXT NULL,
  `trait_data_type` VARCHAR(45) NULL,
  `trait_category` VARCHAR(45) NULL,
  `value` VARCHAR(45) NULL,
  `measure` VARCHAR(45) NULL,
  `sex` VARCHAR(45) NULL,
  `life_stage` VARCHAR(45) NULL,
  `frequency` VARCHAR(45) NULL,
  `sample_size` VARCHAR(45) NULL,
  `event_date` VARCHAR(45) NULL,
  `row_link` VARCHAR(45) NULL,
  `method_abbrev` VARCHAR(45) NULL,
  `method_name` VARCHAR(255) NULL,
  `method_description` TEXT NULL,
  `reference` VARCHAR(4096) NULL,
  `reference_abbrev` VARCHAR(45) NULL,
  `reference_doi` VARCHAR(255) NULL,
  `location_abbrev` VARCHAR(45) NULL,
  `location_lat` VARCHAR(45) NULL,
  `location_lon` VARCHAR(45) NULL,
  `location_precision` VARCHAR(45) NULL,
  `location_altitude` VARCHAR(45) NULL,
  `location_locality` VARCHAR(255) NULL,
  `location_country_code` VARCHAR(45) NULL,
  `location_habitat_global` VARCHAR(255) NULL,
  `location_habitat` TEXT NULL,
  `location_microhabitat` TEXT NULL,
  `location_stratum` TEXT NULL,
  `location_note` TEXT NULL,
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
  `location_country_id` INT NULL,
  `event_date_start` DATETIME NULL,
  `event_date_end` DATETIME NULL,
  `value_numeric` DECIMAL(15,4) NULL,
  `frequency_numeric` DECIMAL(9,4) NULL,
  `sample_size_numeric` INT NULL,
  `location_lat_conv` DECIMAL(11,8) NULL,
  `location_lon_conv` DECIMAL(11,8) NULL,
  `location_altitude_numeric` INT NULL,
  `location_precision_numeric` DECIMAL(11,8) NULL,
  `require_numeric_value` TINYINT(1) NULL,
  `changed` TINYINT(1) NOT NULL,
  `valid` TINYINT(1) NOT NULL,
  `valid_review` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `import_dataset_fk_idx` (`dataset_id` ASC),
  INDEX `import_sex_fk_idx` (`sex_id` ASC),
  INDEX `import_measure_fk_idx` (`measure_id` ASC),
  INDEX `import_method_fk_idx` (`method_id` ASC),
  INDEX `import_trait_kf_idx` (`trait_id` ASC),
  INDEX `import_reference_fk_idx` (`reference_id` ASC),
  INDEX `import_location_fk_idx` (`location_id` ASC),
  INDEX `import_habitat_global_fk_idx` (`location_habitat_global_id` ASC),
  INDEX `import_country_fk_idx` (`location_country_id` ASC),
  INDEX `import_life_stage_fk_idx` (`life_stage_id` ASC),
  INDEX `import_valid_idx` (`valid` ASC),
  INDEX `import_valid_review_idx` (`valid_review` ASC),
  INDEX `import_changed_idx` (`changed` ASC),
  INDEX `import_original_name_idx` (`original_name` ASC),
  INDEX `import_wsc_lsid_idx` (`wsc_lsid` ASC),
  INDEX `import_trait_abbrev_idx` (`trait_abbrev` ASC),
  INDEX `import_trait_name_idx` (`trait_name` ASC),
  INDEX `import_value_idx` (`value` ASC),
  INDEX `import_measure_idx` (`measure` ASC),
  INDEX `import_sex_idx` (`sex` ASC),
  INDEX `import_life_stage_idx` (`life_stage` ASC),
  INDEX `import_event_date_idx` (`event_date` ASC),
  INDEX `import_row_link` (`row_link` ASC),
  INDEX `import_method_abbrev_idx` (`method_abbrev` ASC),
  INDEX `import_method_name_idx` (`method_name` ASC),
  INDEX `import_refrence_abbrev_idx` (`reference_abbrev` ASC),
  INDEX `import_reference_idx` (`reference` ASC),
  INDEX `import_reference_doi_idx` (`reference_doi` ASC),
  INDEX `import_location_abbrev_idx` (`location_abbrev` ASC),
  INDEX `import_location_lat_idx` (`location_lat` ASC),
  INDEX `import_location_lon_idx` (`location_lon` ASC),
  INDEX `import_location_hg_idx` (`location_habitat_global` ASC),
  INDEX `import_location_cc_idx` (`location_country_code` ASC),
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
    FOREIGN KEY (`location_country_id`)
    REFERENCES `spider_traits_db`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE = '';
GRANT USAGE ON *.* TO app;
 DROP USER app;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'app' IDENTIFIED BY 'app';

GRANT SELECT, INSERT, TRIGGER ON TABLE `spider_traits_db`.* TO 'app';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `spider_traits_db`.* TO 'app';
GRANT SELECT ON TABLE `spider_traits_db`.* TO 'app';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
