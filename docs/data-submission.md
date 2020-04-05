# Spider trait database data submission Help

This document covers data submission process and rules to the Spider Trait Database. It also provides tutorial on data modification capabilities of the online data editing tool.

## Data validity

Before the dataset can be comitted to the database, the data must be in a valid format. That basically means that all required attributes must be filled in, all numeric or temporal information must be valid numbers or timestamps  and enumerated values must comply to the list of valid values. The precise definitons of validity requirements can be find below. 

## User roles

The systems defines two user roles related to the data submission:

+ Contributor - an user that uploads the dataset;
+ Editor - an user that approves the dataset.

Both types of users can edit the data in the online data editor to make them valid, however, there are differences in the validity requirements for each of the roles. Contributors have more relaxed requirements. Furthermore, the contributor can submit the dataset for review by the editor even though the dataset is not valid. On the other hand, the editor must ensure that all the data are fully valid. Otherwise, the system won't allow to approve the dataset.

## Submission process

The first steps when uploading a new data to the database is to create a new dataset. The dataset has following properties:

+ Dataset name - Generated automatically, but can be changed to user defined value. The dataset name must be unique, but a unique random id is attached to the provided name so the users don't have to care about the uniqueness of the dataset name.
+ Uploader name - Required field, automatically filled in from the user profile, but can be changed by the user.
+ Uploader e-mail - E-mail of the person who uploads the data. This is a required field.
+ Autohrs - Authors of the dataset. This may or may not be the same person as the uploader.
+ Author email(s) - E-mail adresses of the authors.
+ Notes - any additional ifnormation regarding the data.

Then the dataset is created and contributor is able to upload the data to the newly created dataset.

Contributors can upload the data from the Excel or CSV (comma separated) file. See below for the requirements on the data format. The records from the sheet are imported to the temporary cache for data waiting for approval. At the moment, the data are visible only for the contributor who uploads the data.

Then, they can view the data in the editing tool in the web application. The editing interface notifies the users about invalid records and properties in the dataset. Contributors can edit the data to make them as complying to the database requirements as possible.

When the contributors finish their changes (the dataset is either valid or they can't solve the issues by themselves), they can send the dataset for review to the editors. Contributors can attach a message for the editors when submitting the dataset for review where they can explain any problems they had with making the dataset valid.

Next, the editors can view the uploaded and prepared data and continue in the validation process. This usually means that the editor has to create new entities in the database: references, locations, methods, or in rare occasions also new traits.

Once the dataset is fully valid, the editor can approve the dataset to the database. That means that all the data are transferred from the temporary import cache to the main database and become available to the general public for view and download.

## Recognized column names and validity constraints

The list of column names with their descriptions and allowed values follows. The column names can be formatted in a three notations: with spaces (e.g. `Original name`), with undersocres (`original_name`) or as camelCase (`originalName`). Both Upper case and lower case (or combination) are recognized. You can also combine different types or notation in one file.

+ `wsc_lsid` - Taxonomic identifier (URN) linking the record with World Spider Catalog. Example: `urn:lsid:nmbe.ch:spidersp:033381`
+ `original_name` - **Mandatory**. Full taxon name as assigned by the author in the original source (that is, not changed based on later taxonomical amendations). If no LSID is provided, the original name should be known to the World Spider Catalog at least as a synonym, homonym, or a known combination. Example: `Pimoa rupicola`.
+ `trait_abbrev` - **Mandatory**. Unique identifier linking to the list of traits. Example: `habi`
+ `trait_name` - Trait name. Example: `IUCN Habitat`.
+ `trait_description` - Trait description. Example: `habitat following global classification`.
+ `trait_data_type` - Trait data type. Valid values: `Binary`, `Character`, `Integer`, `Percentage`, `Real number`, `Real number (0-1)`.
+ `trait_category` - Trait Life category. Valid values: `Anatomy`, `Biomechanical`, `Defense`, `Ecology`, `Life History`, `Morphology`, `Morphometric`, `Physiological`, `Predation`, `Reproduction`.
+ `method_abbrev` - Unique identifier linking to the list of methods. Example: `pitt`.
+ `method_name` - Method name. Example: `Pitfall traps`.
+ `method_description` - Method description. Example: `Observation made on a specimen caught in a pitfall trap.`.
+ `value` - **Mandatory**. Trait value. If the Trait data type is not Character, the value must be a valid number. Decimal point (`.`) is used. Percentage sign (`%`) is allowed.
+ `measure` - Mearue: Categorical variable. Valid values: `Single observation`, `Mean`, `Median`, `Min`, `Max`.
+ `sex` - Sex: Categorical variable. Valid values: `Female`, `Male`, `Both`, `Unknown`.
+ `life_stage` - Life stage: Categorical variable. Valid values: `Egg`, `Spiderling`, `Juvenile`, `Adult`, `All`.
+ `frequency` - Relative frequency of occurrence. Real number.  
+ `sample_size` - Total number of observations per record. Integer.
+ `event_date` - The date-time or interval associated to the trait. The value must be either omitted or comply to one of the supported formats:
  + `1963-03-08T14:07-0600` - 8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC.
  + `2009-02-20T08:40Z` - 20 February 2009 8:40am UTC.
  + `2018-08-29T15:19` - 3:19pm local time on 29 August 2018.
  + `1809-02-12` - some time during 12 February 1809.
  + `1906-06` - some time in June 1906.
  + `1971` - some time in the year 1971.
  + `2007-03-01T13:00:00Z/2008-05-11T15:30:00Z` - some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC.
  + `1900/1909` - some time during the interval between the beginning of the year 1900 and the end of the year 1909.
  + `1906-06/1906-07` - some time during the interval between the beginning of the June 1906 and the end of July 1906.
  + `2007-11-13/15` - some time in the interval between 13 November 2007 and 15 November 2007.
+ `reference_abbrev` - Unique identifier linking to the list of references. This column is used only in special cases as reference abbreviations are generated automatically during the review process.
+ `reference` - **Mandatory** (if no `reference_abbrev` is provided) Reference related to the trait, preferentially in the format used in the world spider catalog. Examples:
  + Journal: `Thaler, K. & Plachter, H. (1983). Spinnen aus Höhlen der Fränkischen Alb, Deutschland (Arachnida: Araneae: Erigonidae, Linyphiidae). Senckenbergiana Biologica 63: 249-263.`
  + Book: `Yaginuma, T. (1962). The spider fauna of Japan. Arachnological Society of East Asia Osaka, 74 pp.`
  + Book Chapter: `Pickard-Cambridge, O. (1891). Arachnida. Araneida. In: Biologia Centrali-Americana, Zoology. London 1, 73-88.`
  + Website: `World Spider Catalog (2019). World Spider Catalog. Version 20.5. Natural History Museum Bern, online at http://wsc.nmbe.ch, accessed on {date of access}.`
+ `reference_doi` - DOI of the reference.
+ `row_link` - Used for multidimensional data, i.e. use same numbers for rows that contain data from same individuals or populations obtained in the same context.
+ `location_abbrev` - Unique identifier linking to the list of known locations. This column is used only in special cases as reference abbreviations are generated automatically during the review process.
+ `location_lat` - The geographic latitude of the geographic center of a Location. Preffered format is  decimal degrees, using the spatial reference system WGS84. Positive values are north of the Equator, negative values are south of it. Legal values lie between -90 and 90, inclusive. Other widely used formats are also parsed correctly. Examples: `45.74`, `-37.22285`.
+ `location_lon` - The geographic longitude of the geographic center of a Location. Preffered format is decimal degrees, using the spatial reference system WGS84. Positive values are east of the Greenwich Meridian, negative values are west of it. Legal values lie between -180 and 180, inclusive. Other widely used formats are also parsed correctly. Examples: `102.478922`, `-0.4767`.
+ `location_precision` - A decimal representation of the precision of the coordinates given in the `location_lat` and `location_lon`.
+ `location_altitude` - Altitude above the sea level in meters. Integer. Examples: `700`, `3462`.
+ `location_locality` - The original textual description of the place. Examples: `Municipality of Helsinki`, `small hill close to the river`, `Mount Fuji`.
+ `location_country_code` - The standard code for the country. Both two-character and three-chartacter codes are recognized. Examples: `CZ`, `IT`, `BR`, `CZE`.
+ `location_habitat_global` - A description of the global habitat based on [IUCN habitats](https://www.iucnredlist.org/resources/habitat-classification-scheme). Examples: `Savanna - Dry`.
+ `location_habitat` - Verbatim description of the habitat. Examples: `forest`, `grassland`, `cave`, CORINE habitat code.
+ `location_microhabitat` - Verbatim description of the microhabitat. Examples: `under stones`, `ground`, `canopy`.
+ `location_stratum` - Verbatim description of the stratum. Examples: `subterranean`, `epigean`, `under water`, `arboreal`, index of verticality.
+ `location_note` - Any note related to information provided. Examples: Habitat classification according to CORINE, index of verticality based on the COBRA protocol, altitude is not precise.

### Additional validity requirements

+ Contributor should provide either only the `trait_abbrev` or all of the `trait_name`, `trait_description`, `trait_data_type`, `trait_category` if there is no such trait defined in the Spider Trait Database catalog. The `trait_abbrev` will be proposed later by the editor.
+ Contributor should provide either only the `method_abbrev` if the method exist or both the `method_name` and `method_description` if there is no such method defined in the Spider Trait Database catalog.  The `method_abbrev` will be proposed later by the editor.
+ If any of the columns starting with `location_` is filled in, a new location must be created by the editor. The `location_abbrev` will be generated and assigned to the correct records by the application.
+ For every new reference, a new record in the references list must be created by the editor. The `reference_abbrev` will be generated and assigned to the correct records by the application.

## Data editor capabilites

The types of edit that can be done using the data editor are:

+ Providng a missing required value
+ Replacing an unrecognized value with a value from an enumeration list (e.g. fixing typos, replacing synonyms)
+ Replacing unparsable value with a valid representation (numbers, timestamps, coordinates)
+ Deleting records that can't be made valid
+ Creating new entites (references, locations, methods, traits) - editors only

## Data editor How To

Detailed instructions on how to use the data editor can be found in the [Data Editor HowTo](editor-howto.md).
