CREATE TABLE `taxonomy_name` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `taxonomy_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `valid` TINYINT NOT NULL,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `country` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `alpha2_code` VARCHAR(5) NOT NULL,
  `alpha3_code` VARCHAR(5) NULL DEFAULT NULL ,
  `name` VARCHAR(255) NOT NULL,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `import` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `dataset_id` INT NOT NULL,
  `wsc_lsid` VARCHAR(45) NULL DEFAULT NULL ,
  `original_name` VARCHAR(255) NULL DEFAULT NULL ,
  `taxonomy_order` VARCHAR(255) NULL DEFAULT NULL ,
  `taxonomy_family` VARCHAR(255) NULL DEFAULT NULL ,
  `taxonomy_taxon` VARCHAR(255) NULL DEFAULT NULL ,
  `trait_abbrev` VARCHAR(45) NULL DEFAULT NULL ,
  `trait_name` VARCHAR(255) NULL DEFAULT NULL ,
  `trait_description` TEXT NULL DEFAULT NULL ,
  `trait_data_type` VARCHAR(45) NULL DEFAULT NULL ,
  `trait_category` VARCHAR(45) NULL DEFAULT NULL ,
  `value` VARCHAR(255) NULL DEFAULT NULL ,
  `measure` VARCHAR(45) NULL DEFAULT NULL ,
  `sex` VARCHAR(45) NULL DEFAULT NULL ,
  `life_stage` VARCHAR(45) NULL DEFAULT NULL ,
  `frequency` VARCHAR(45) NULL DEFAULT NULL ,
  `sample_size` VARCHAR(45) NULL DEFAULT NULL ,
  `treatment` VARCHAR(255) NULL DEFAULT NULL ,
  `event_date` VARCHAR(45) NULL DEFAULT NULL ,
  `note` TEXT NULL DEFAULT NULL ,
  `row_link` VARCHAR(45) NULL DEFAULT NULL ,
  `method_abbrev` VARCHAR(45) NULL DEFAULT NULL ,
  `method_name` VARCHAR(255) NULL DEFAULT NULL ,
  `method_description` TEXT NULL DEFAULT NULL ,
  `reference` VARCHAR(1024) NULL DEFAULT NULL ,
  `reference_abbrev` VARCHAR(255) NULL DEFAULT NULL ,
  `reference_doi` VARCHAR(255) NULL DEFAULT NULL ,
  `location_abbrev` VARCHAR(45) NULL DEFAULT NULL ,
  `location_lat` VARCHAR(45) NULL DEFAULT NULL ,
  `location_lon` VARCHAR(45) NULL DEFAULT NULL ,
  `location_precision` VARCHAR(45) NULL DEFAULT NULL ,
  `altitude` VARCHAR(45) NULL DEFAULT NULL ,
  `locality` VARCHAR(255) NULL DEFAULT NULL ,
  `country_code` VARCHAR(45) NULL DEFAULT NULL ,
  `habitat` TEXT NULL DEFAULT NULL ,
  `microhabitat` TEXT NULL DEFAULT NULL ,
  `taxonomy_id` INT NULL DEFAULT NULL ,
  `sex_id` INT NULL DEFAULT NULL ,
  `life_stage_id` INT NULL DEFAULT NULL ,
  `measure_id` INT NULL DEFAULT NULL ,
  `method_id` INT NULL DEFAULT NULL ,
  `trait_id` INT NULL DEFAULT NULL ,
  `trait_data_type_id` INT NULL DEFAULT NULL ,
  `trait_category_id` INT NULL DEFAULT NULL ,
  `reference_id` INT NULL DEFAULT NULL ,
  `location_id` INT NULL DEFAULT NULL ,
  `location_habitat_global_id` INT NULL DEFAULT NULL ,
  `country_id` INT NULL DEFAULT NULL ,
  `event_date_start` DATETIME NULL DEFAULT NULL ,
  `event_date_end` DATETIME NULL DEFAULT NULL ,
  `value_numeric` DECIMAL(15,4) NULL DEFAULT NULL ,
  `frequency_numeric` DECIMAL(9,4) NULL DEFAULT NULL ,
  `sample_size_numeric` INT NULL DEFAULT NULL ,
  `altitude_numeric` INT NULL DEFAULT NULL ,
  `location_lat_conv` DECIMAL(11,8) NULL DEFAULT NULL ,
  `location_lon_conv` DECIMAL(11,8) NULL DEFAULT NULL ,
  `location_precision_numeric` DECIMAL(11,8) NULL DEFAULT NULL ,
  `require_numeric_value` TINYINT NULL DEFAULT NULL ,
  `changed` TINYINT NOT NULL,
  `valid` TINYINT NOT NULL,
  `valid_review` TINYINT NOT NULL,
  `duplicate` TINYINT NOT NULL,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `life_stage` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(45) NOT NULL COMMENT 'Categorical variable. One of: egg, spiderling, juvenile, adult, all
' ,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `trait` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `abbrev` VARCHAR(45) NOT NULL,
  `trait_category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL ,
  `data_type_id` INT NOT NULL,
  `standard` TEXT NULL DEFAULT NULL ,
  `reference_id` INT NULL DEFAULT NULL ,
   PRIMARY KEY (`id`),
  CONSTRAINT `abbrev_UNIQUE` UNIQUE (`abbrev`)
)
ENGINE = InnoDB;
CREATE TABLE `location` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `abbrev` VARCHAR(45) NOT NULL,
  `lat` DECIMAL(11,8) NULL DEFAULT NULL  COMMENT 'The geographic latitude (in decimal degrees, using the spatial reference system WGS84) of the geographic center of a Location. Positive values are north of the Equator, negative values are south of it. Legal values lie between -90 and 90, inclusive (e.g. 45.74, -37.22285; etc.)' ,
  `lon` DECIMAL(11,8) NULL DEFAULT NULL  COMMENT 'The geographic longitude (in decimal degrees, using the spatial reference system WGS84) of the geographic center of a Location. Positive values are east of the Greenwich Meridian, negative values are west of it. Legal values lie between -180 and 180, inclusive. (e.g. 102.478922; -0.4767; etc.)
' ,
  `precision` DECIMAL(11,8) NULL DEFAULT NULL  COMMENT 'A decimal representation of the precision of the coordinates given in the decimalLatitude and decimalLongitude.' ,
  `altitude` INT NULL DEFAULT NULL  COMMENT 'Altitude above the sea level in meters. (e.g. 700, 3462, etc.)' ,
  `locality` VARCHAR(255) NULL DEFAULT NULL  COMMENT 'The original textual description of the place. (e.g. Municipality of Helsinki; small hill close to the river; Mount Fuji)' ,
  `country_id` INT NULL DEFAULT NULL  COMMENT 'The standard code for the country. (e.g. CZ, IT, BR, etc.)' ,
  `habitat_global_id` INT NULL DEFAULT NULL  COMMENT 'A description of the global habitat based on IUCN habitats – https://www.iucnredlist.org/resources/habitat-classification-scheme (e.g. Savanna - Dry; Forest, etc.)' ,
  `habitat` TEXT NULL DEFAULT NULL  COMMENT 'Verbatim description of the habitat (e.g. forest, grassland, cave, CORINE habitat code, etc.)
' ,
  `microhabitat` TEXT NULL DEFAULT NULL  COMMENT 'Verbatim description of the microhabitat (e.g. under stones, ground, canopy, etc.)
' ,
  `stratum` TEXT NULL DEFAULT NULL  COMMENT 'Verbatim description of the stratum. (ex. subterranean, epigean, under water, arboreal, index of verticality, etc.)
' ,
  `note` TEXT NULL DEFAULT NULL ,
   PRIMARY KEY (`id`),
  CONSTRAINT `abbrev_UNIQUE` UNIQUE (`abbrev`)
)
ENGINE = InnoDB;
CREATE TABLE `sex` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(45) NOT NULL COMMENT 'Categorical variable; female, male; both; unknown
' ,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `trait_category` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL ,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `method` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `abbrev` VARCHAR(45) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL ,
  `reference_id` INT NULL DEFAULT NULL ,
   PRIMARY KEY (`id`),
  CONSTRAINT `abbrev_UNIQUE` UNIQUE (`abbrev`)
)
ENGINE = InnoDB;
CREATE TABLE `taxonomy` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `wsc_lsid` VARCHAR(45) NULL DEFAULT NULL ,
  `order` VARCHAR(255) NULL DEFAULT NULL ,
  `family` VARCHAR(255) NULL DEFAULT NULL ,
  `genus` VARCHAR(255) NULL DEFAULT NULL ,
  `species` VARCHAR(255) NULL DEFAULT NULL ,
  `subspecies` VARCHAR(255) NULL DEFAULT NULL ,
  `author` VARCHAR(255) NULL DEFAULT NULL ,
  `year` INT NULL DEFAULT NULL ,
  `valid` TINYINT NOT NULL,
  `valid_wsc_lsid` VARCHAR(45) NULL DEFAULT NULL ,
  `valid_id` INT NULL DEFAULT NULL ,
  `full_name` VARCHAR(255) NULL DEFAULT NULL ,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `measure` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(45) NOT NULL COMMENT 'valid categories: single observation; mean; median; min; max
' ,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `dataset` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `authors` VARCHAR(1024) NULL DEFAULT NULL ,
  `uploader` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL ,
  `authors_email` VARCHAR(255) NULL DEFAULT NULL ,
  `doi` VARCHAR(45) NULL DEFAULT NULL ,
  `date` DATETIME NOT NULL,
  `notes` TEXT NULL DEFAULT NULL ,
  `imported` TINYINT NOT NULL,
  `sub` VARCHAR(45) NOT NULL,
  `message` VARCHAR(4096) NULL DEFAULT NULL ,
  `records` INT NOT NULL DEFAULT 0 ,
  `source_file` VARCHAR(512) NULL DEFAULT NULL ,
  `restricted` TINYINT NOT NULL DEFAULT 0 ,
   PRIMARY KEY (`id`),
  CONSTRAINT `name_UNIQUE` UNIQUE (`name`)
)
ENGINE = InnoDB;
CREATE TABLE `habitat_global` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `category` VARCHAR(255) NULL DEFAULT NULL ,
  `name` VARCHAR(255) NOT NULL,
  `number` VARCHAR(10) NOT NULL,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `reference` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `doi` VARCHAR(255) NULL DEFAULT NULL ,
  `full_citation` VARCHAR(1024) NOT NULL,
  `abbrev` VARCHAR(255) NOT NULL,
   PRIMARY KEY (`id`),
  CONSTRAINT `abbrev_UNIQUE` UNIQUE (`abbrev`)
)
ENGINE = InnoDB;
CREATE TABLE `data` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `taxonomy_id` INT NOT NULL COMMENT 'Taxonomic identifier linking with World Spider Catalog
' ,
  `original_name` VARCHAR(255) NOT NULL COMMENT 'Full taxon name as assigned by the author in the original source (that is, not changed based on later taxonomical amendations). (ex. Pimoa rupicola)' ,
  `trait_id` INT NOT NULL COMMENT 'unique identifier linking to trait table
' ,
  `value` VARCHAR(255) NULL DEFAULT NULL  COMMENT 'trait value' ,
  `value_numeric` DECIMAL(15,4) NULL DEFAULT NULL ,
  `measure_id` INT NOT NULL COMMENT 'valid categories: single observation; mean; median; min; max
' ,
  `sex_id` INT NULL DEFAULT NULL  COMMENT 'Categorical variable; female, male; both; unknown
' ,
  `life_stage_id` INT NULL DEFAULT NULL  COMMENT 'Categorical variable. One of: egg, spiderling, juvenile, adult, all
' ,
  `frequency` DECIMAL(9,4) NULL DEFAULT NULL  COMMENT 'Real number. Relative frequency of occurrence. 
' ,
  `sample_size` INT NULL DEFAULT NULL  COMMENT 'Integer. Total number of observation per record.
' ,
  `treatment` VARCHAR(255) NULL DEFAULT NULL ,
  `event_date_text` VARCHAR(255) NULL DEFAULT NULL  COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).
' ,
  `event_date_start` DATETIME NULL DEFAULT NULL  COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).
' ,
  `event_date_end` DATETIME NULL DEFAULT NULL  COMMENT 'The date-time or interval associated to the trait. Examples: 1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 2009-02-20T08:40Z (20 February 2009 8:40am UTC). 2018-08-29T15:19 (3:19pm local time on 29 August 2018). 1809-02-12 (some time during 12 February 1809). 1906-06 (some time in June 1906). 1971 (some time in the year 1971). 2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).
' ,
  `altitude` INT NULL DEFAULT NULL  COMMENT 'Altitude above the sea level in meters. (e.g. 700, 3462, etc.)' ,
  `locality` VARCHAR(255) NULL DEFAULT NULL  COMMENT 'The original textual description of the place. (e.g. Municipality of Helsinki; small hill close to the river; Mount Fuji)' ,
  `country_id` INT NULL DEFAULT NULL  COMMENT 'The standard code for the country. (e.g. CZ, IT, BR, etc.)' ,
  `habitat` TEXT NULL DEFAULT NULL  COMMENT 'Verbatim description of the habitat (e.g. forest, grassland, cave, CORINE habitat code, etc.)' ,
  `microhabitat` TEXT NULL DEFAULT NULL  COMMENT 'Verbatim description of the microhabitat (e.g. under stones, ground, canopy, etc.)' ,
  `note` TEXT NULL DEFAULT NULL ,
  `row_link` INT NULL DEFAULT NULL  COMMENT 'for multidimensional data, i.e. use same numbers for rows that contain data from same individuals or populations obtained in the same context
' ,
  `method_id` INT NULL DEFAULT NULL  COMMENT 'unique identifier linking to Methods table' ,
  `location_id` INT NULL DEFAULT NULL  COMMENT 'unique identifier linking to Location table
' ,
  `dataset_id` INT NOT NULL,
  `reference_id` INT NOT NULL,
   PRIMARY KEY (`id`),
  CONSTRAINT `id_UNIQUE` UNIQUE (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `data_type` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL ,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
ALTER TABLE `taxonomy_name` ADD CONSTRAINT `taxonomy_name_taxonomy_fk` FOREIGN KEY (`taxonomy_id`) REFERENCES `taxonomy` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_country_fk` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_life_stage_fk` FOREIGN KEY (`life_stage_id`) REFERENCES `life_stage` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_method_fk` FOREIGN KEY (`method_id`) REFERENCES `method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_trait_kf` FOREIGN KEY (`trait_id`) REFERENCES `trait` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_dataset_fk` FOREIGN KEY (`dataset_id`) REFERENCES `dataset` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_location_fk` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_reference_fk` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_habitat_global_fk` FOREIGN KEY (`location_habitat_global_id`) REFERENCES `habitat_global` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_measure_fk` FOREIGN KEY (`measure_id`) REFERENCES `measure` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `import` ADD CONSTRAINT `import_sex_fk` FOREIGN KEY (`sex_id`) REFERENCES `sex` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trait` ADD CONSTRAINT `trait_trait_category_fk` FOREIGN KEY (`trait_category_id`) REFERENCES `trait_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trait` ADD CONSTRAINT `trait_data_type_fk` FOREIGN KEY (`data_type_id`) REFERENCES `data_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trait` ADD CONSTRAINT `trait_reference_fk` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `location` ADD CONSTRAINT `location_country_fk` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `location` ADD CONSTRAINT `location_habitat_global_fk` FOREIGN KEY (`habitat_global_id`) REFERENCES `habitat_global` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `method` ADD CONSTRAINT `method_reference_fk` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `taxonomy` ADD CONSTRAINT `taxonomy_valid_id` FOREIGN KEY (`valid_id`) REFERENCES `taxonomy` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `data` ADD CONSTRAINT `data_life_stage_fk` FOREIGN KEY (`life_stage_id`) REFERENCES `life_stage` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `data` ADD CONSTRAINT `data_method_fk` FOREIGN KEY (`method_id`) REFERENCES `method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `data` ADD CONSTRAINT `data_location_fk` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `data` ADD CONSTRAINT `data_reference_fk` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `data` ADD CONSTRAINT `data_dataset_fk` FOREIGN KEY (`dataset_id`) REFERENCES `dataset` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `data` ADD CONSTRAINT `data_measure_fk` FOREIGN KEY (`measure_id`) REFERENCES `measure` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
