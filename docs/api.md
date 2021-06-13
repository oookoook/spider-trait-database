# World Spider Traits Database API

The WSTDB provides an API for programmatic access to the data.

The base data endpoint address is <https://spidertraits.sci.muni.cz/backend/data>, optionally followed by query filters. The endpoint supports the `GET` HTTP verb.

## Response structure

The API response returns a JSON object with the following structure:

* `items` - Array of data records. The record format is similar to the structure of the datasets that are inserted into the database. However, it adds a hierarchical structure, and it follows different naming conventions (using [camelCase](https://en.wikipedia.org/wiki/Camel_case) instead of [snake_case](https://en.wikipedia.org/wiki/Snake_case)). Refer to [the template specification](template.md) for more details on the provided attributes:

  * `id` - Unique record identifier.
  * `originalName` - Taxon name as reported in the original source.
  * `value` - Measured value of a trait.
  * `frequency` - Relative frequency of occurrence.
  * `sampleSize` - Total number of observations per record.
  * `treatment` - Treatment conditions if applicable.
  * `eventDate` - Temporal specification of the record. It consists of the following parts:

    * `text` - original value as provided in the dataset. Maps to the `date` column in [the template](template.md).
    * `start` - parsed beginning of the event.
    * `end` - parsed end of the event.

  * `taxonomy` - Taxonomical information related to the record. Provides the WSC taxon information

    * `lsid` - WSC LSID identifier.
    * `order` - For future use.
    * `family` - Taxonomic family.
    * `genus` - Taxonomic genus.
    * `species` - Taxonomic species.
    * `subspecies` - Taxonomic subspecies.

  * `trait` - Information about the observed trait. Consists of:

    * `id` - Unique trait ID.
    * `abbrev` - Unique trait abbreviation.
    * `name` - Full trait name
    * `category` - Trait category description. Contains two attributes:

      * `id` - Unique category ID.
      * `name` - Category name

  * `measure` - Information about the record measure. Consists of:

    * `id` - Unique ID.
    * `name` - Full name.

  * `sex` - Information about the sex of the specimen. Consists of:

    * `id` - Unique ID.
    * `name` - Full name.

  * `lifeStage` - Information about the specimen life stage. Consists of:

    * `id` - Unique ID.
    * `name` - Full name.

  * `method` - Information about the method used. Consists of:

    * `id` - Unique ID.
    * `abbrev` - Unique abbreviation.
    * `name` - Full name.

  * `location` - Information about the location used. Consists of:

    * `id` - Unique ID.
    * `abbrev` - Unique abbreviation.
    * `coords` - Geographic coordinates of the location:

      * `lat` - Latitude (WGS84)
      * `lon` - Longitude (WGS84)

  * `altitude` - Altitude of the location. 
  * `locality` - The name or description of the place.
  * `habitat` - Habitat type according to a local classification, such as EUNIS, CORINE.
  * `microhabitat` - Microhabitat type.
  * `country` - The standard code for the country. Consists of:

    * `id` - Unique ID.
    * `name` - Full name.
    * `code` - [ISO 3166 Alpha-3 code](https://en.wikipedia.org/w/index.php?title=List_of_ISO_3166_country_codes&oldid=933109715) of the country.

  * `dataset` - Dataset information. Consists of:

    * `id` - Unique ID.
    * `name` - Full dataset name.
    * `authors` - Authors of the dataset
    * `restricted` - Boolean indicating if the usage of the record is restricted.

  * `reference` - Citation of the published or unpublished data. Consists of:

    * `id` - Unique ID.
    * `abbrev` - Reference abbreviation.
  
  * `note` - Any note related to information provided
  * `rowLink` - To mark data from the same study, same individuals, or same populations.
* `limit` - Number of records that were requested in the query.
* `offset` - Number of records skipped (used for query paging - see below).
* `count` - Total number of records matching the filter.
* `restricted` - Boolean indicating if the query filter matches records with a restricted usage.
* `restrictedDatasets` - An array of dataset identifiers. Every dataset in the list has a usage restriction in place. The array items consist of:
  
  * `id` - Unique dataset id.
  * `name` - Dataset name.

Full example:

```http
GET https://spidertraits.sci.muni.cz/backend/data/family/*/genus/*/species/5682/original-name/*/trait-category/*/trait/*/method/*/location/*/country/*/dataset/*/authors/*/reference/*/row-link/*?limit=1&offset=100&count=true
```

```json

{
    "items": [{
        "id": 527252,
        "originalName": "Atypus affinis",
        "value": "forest",
        "frequency": 1,
        "sampleSize": null,
        "treatment": null,
        "eventDate": {
            "text": "1984-05-29",
            "start": "1984-05-29T00:00:00.000Z",
            "end": "1984-05-29T23:59:59.000Z"
        },
        "taxonomy": {
            "lsid": "urn:lsid:nmbe.ch:spidersp:000078",
            "order": null,
            "family": "Atypidae",
            "genus": "Atypus",
            "species": "affinis",
            "subspecies": null
        },
        "trait": {
            "id": 23,
            "abbrev": "habi",
            "name": "IUCN Habitat",
            "category": {
                "id": 5,
                "name": "Ecology"
            }
        },
        "measure": {
            "id": 1,
            "name": "Single observation"
        },
        "sex": {
            "id": 1,
            "name": "Male"
        },
        "lifeStage": {
            "id": 4,
            "name": "Adult"
        },
        "method": {
            "id": 1,
            "abbrev": "ptf",
            "name": "Pitfall Trapping"
        },
        "location": {
            "id": null,
            "abbrev": null,
            "coords": null
        },
        "altitude": null,
        "locality": null,
        "habitat": null,
        "microhabitat": null,
        "country": {
            "id": null,
            "name": null,
            "code": null
        },
        "dataset": {
            "id": 23,
            "name": "Habitat of CZ male spiders",
            "authors": "Řezáč M (Czech Arachnological Society)",
            "restricted": true
        },
        "reference": {
            "id": 104,
            "abbrev": "Buchar & Růžička 2002"
        },
        "note": null,
        "rowLink": null
    }
    ],
    "limit": 1,
    "offset": 100,
    "count": 121,
    "restricted": true,
    "restrictedDatasets": [{
        "id": 58,
        "name": "Behavioural data from literature 4"
    }, {
        "id": 55,
        "name": "Predators of spiders from literature"
    }, {
        "id": 10,
        "name": "Courtship of spiders from literature"
    }, {
        "id": 18,
        "name": "Prosoma sizes of CZ spiders from literature"
    }, {
        "id": 31,
        "name": "Habitats of CZ spider females"
    }, {
        "id": 29,
        "name": "Habitat of CZ juvenile spiders"
    }, {
        "id": 23,
        "name": "Habitat of CZ male spiders"
    }]
}

```

## Data filtering

The most generic query with optional filters in place looks like this:

<https://spidertraits.sci.muni.cz/backend/data/family/*/genus/*/species/*/original-name/*/trait-category/*/trait/*/method/*/location/*/country/*/dataset/*/authors/*/reference/*/row-link/*>

Asterisk (`*`) serves as a wildcard, meaning *all values*.

The easiest way to construct the filter is to use the WSTDB Data Explorer to compose the query and then use the *Share* button to get the link with the filter configured. Then modify the link to include `backend` before the `/data` part of the link to retrieve JSON results.

If you need to construct the filter programmatically, you will have to use the other endpoints of the API. We will illustrate this approach by the following example:

The goal is to retrieve records for the *Atypus affinis* taxon.

First, we have to query the taxonomy endpoint to get the ID of the taxon:

```http
GET https://spidertraits.sci.muni.cz/backend/taxonomy?searchField=fullName&searchValue=Atypus+affinis
```

The response will look like this:

```json
{
    "items": [{
        "id": 5682,
        "lsid": "urn:lsid:nmbe.ch:spidersp:000078",
        "synchronized": true,
        "valid": true,
        "validTaxon": {
            "id": null
        },
        "order": null,
        "family": "Atypidae",
        "genus": "Atypus",
        "species": "affinis",
        "subspecies": null,
        "author": "Eichwald",
        "year": 1830
    }],
    "limit": 10,
    "offset": 0,
    "count": 1
}
```

We can retrieve the taxon ID as `items[0].id`. Then, we can use the ID in the data filter:

```¨http

GET https://spidertraits.sci.muni.cz/backend/data/family/*/genus/*/species/5682/original-name/*/trait-category/*/trait/*/method/*/location/*/country/*/dataset/*/authors/*/reference/*/row-link/*

```

This approach is similar for all the other query parameters.

## Paging

We can define three paging parameters for each query:

* `count` - if set to true (`count=true`), the response will contain information about the total number of records matching the filter.  The parameter is usually used only with the query for the first page.
* `limit` - number of records returned. Default is 10 records.
* `offset` - number of records from start to omit. The parameter is used for subsequent queries to fetch more pages. Default is 0.

An example of subsequent queries:

```http

GET https://spidertraits.sci.muni.cz/backend/data/family/*/genus/*/species/*/original-name/*/trait-category/*/trait/*/method/*/location/*/country/*/dataset/*/authors/*/reference/*/row-link/*?count=true&limit=100&offset=0

GET https://spidertraits.sci.muni.cz/backend/data/family/*/genus/*/species/*/original-name/*/trait-category/*/trait/*/method/*/location/*/country/*/dataset/*/authors/*/reference/*/row-link/*?limit=100&offset=100

GET https://spidertraits.sci.muni.cz/backend/data/family/*/genus/*/species/*/original-name/*/trait-category/*/trait/*/method/*/location/*/country/*/dataset/*/authors/*/reference/*/row-link/*?limit=100&offset=200

```