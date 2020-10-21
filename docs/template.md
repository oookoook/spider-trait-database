# Template column names and validity constraints

The Template contains the following 31 variables. Here follow their descriptions and eligible values.

* `wsc_lsid` – Taxonomic identifier (URN) linking the record with the World Spider Catalog (character). Example: `urn:lsid:nmbe.ch:spidersp:033381`
* `original_name` – **Mandatory**. Taxon name as reported in the original source. If no LSID is provided, the original name should be known to the World Spider Catalog at least as a synonym, homonym, or a known combination (character). Example: `Zodarion sp.`, `Pimoa rupicola`.
* `trait_abbrev` – **Mandatory**. Abbreviation according to the List of Traits (character). Example: `indu`
* `trait_category` – Trait category according to the List of Traits (character). Example: `Anatomy`.
* `trait_name` – Trait name according to the List of Traits (character). Example: `Instar duration`.
* `trait_description` – Trait description according to the List of Traits (character). Example: `Number of days spent in a certain ontogenetic stage (egg, larva, or instar) at a certain temperature`.
* `trait_data_type` – Trait data type (character). Eligible values include `integer`, `real number`, `character`.
* `Trait_unit` – Units in which a trait is measured (character). Example: `mm`.
* `value` – **Mandatory**. Measured value of a trait (Real number). Dot is used to separate decimals. Percentage sign (`%`) is allowed.
* `measure` – Type of the measured value (character). Eligible values are: `single observation`, `mean`, `median`, `min`, `max`, `description`.
* `sex` – Sex (character). Eligible values are: `female`, `male`, `both`, `unknown`.
* `life_stage` – Ontogenetic stage (character). Eligible values are: `egg`, `larva`, `juvenile`, `adult`, `all`.
* `frequency` – Relative frequency of occurrence (real number). Dot is used to separate decimals
* `sample_size` – Total number of observations per record (integer).
* `treatment`– Treatment conditions if applicable (e.g., effect of pesticide, presence of a predator, etc.) or additional information for some data such as wavelength or temperature (character).
* `method_abbrev` – Abbreviation according to the List of Methods (character). Example: `ptf`.
* `method_name` – Method name according to the List of Methods (character). Example: `Pitfall trapping`.
* `method_description` – Short method description according to the List of Methods (character). Example: `Observation performed under laboratory conditions.`
* `location_abbrev` - Unique identifier linking to the list of known locations (character).
* `latitude` – The geographic latitude (in decimal degrees) using the spatial reference system (WGS84) of the geographic center of a location. Other widely used formats are also parsed correctly. Examples: `45.74`, `-37.22285`.
* `longitude` – The geographic longitude (in decimal degrees) using the spatial reference system (WGS84) of the geographic center of a Location. Other widely used formats are also parsed correctly. Examples: `102.478922`, `-0.4767`.
* `altitude` – Altitude of the location, above sea level in meters (integer).
* `locality` – The name or description of the place (character). Examples: `Municipality of Helsinki`, `small hill close to the river`, `Mount Fuji`.
* `country` – The standard code for the country. Both two-character and three-character codes are recognized (character). Examples: `CZ`, `IT`, `BR`, `CZE`.
* `habitat`– Habitat type according to a local classification, such as EUNIS, CORINE (character). Examples: pine `forest`, `grassland`, `cave`.
* `microhabitat` – Microhabitat type (character). Examples: `under stones`, `ground`, `canopy`.
* `date` – The date-time or interval associated with the trait. The value must comply with one of supported formats:
  * `1963-03-08T14:07-0600` - 8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC.
  * `2009-02-20T08:40Z` - 20 February 2009 8:40am UTC.
  * `2018-08-29T15:19` - 3:19pm local time on 29 August 2018.
  * `1809-02-12` - some time during 12 February 1809.
  * `1906-06` - some time in June 1906.
  * `1971` - some time in the year 1971.
  * `2007-03-01T13:00:00Z/2008-05-11T15:30:00Z` - some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC.
  * `1900/1909` - some time during the interval between the beginning of the year 1900 and the end of the year 1909.
  * `1906-06/1906-07` - some time during the interval between the beginning of June 1906 and the end of July 1906.
  * `2007-11-13/15` - some time in the interval between 13 November 2007 and 15 November 2007.
* `note` – Any note related to information provided, such as type of habitat classification, experimental procedure, etc. (character).
* `row_link` – To mark data from the same study, same individuals, or same populations (character)
* `reference_abbrev` – Unique identifier according to the List of References (character).
* `reference` – **Mandatory** (if no `reference_abbrev` is provided). Citation of the published or unpublished data (character). Examples:
  * Journal: Elias DO, Hebets EA, Hoy RR & Mason AC. 2005. Seismic signals are crucial for male mating success in a visual specialist jumping spider (Araneae: Salticidae). Animal Behaviour 69(4): 931–938.
  * Book: Preston-Mafham R. 1990. The Book of Spiders and Scorpions. London, Quantum Books.
  * Book Chapter: Nentwig W. 1987. The prey of spiders. In Nentwig W (Ed.),  Ecophysiology of Spiders. Berlin, Springer-Verlag, pp. 249–263.
  * Website: Norton R. 2006. How to train a cat to operate a light switch [Video file]. [http://www.youtube.com/watch?v=Vja83KLQXZs](http://www.youtube.com/watch?v=Vja83KLQXZs)
