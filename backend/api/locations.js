var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'location');
    var results = await db.query({table: 'location', sql: `SELECT location.id, location.abbrev, location.locality, country.id, country.alpha3_code, country.name, habitat_global.id, habitat_global.name `
     + `FROM location LEFT JOIN country ON location.country_id = country.id LEFT JOIN habitat_global ON location.habitat_global_id = habitat_global.id`, nestTables: true, limits });    
     res.items = results.map(r => {    
        return {
                id: r.location.id,
                abbrev: r.location.abbrev,
                locality: r.location.locality,
                country: {
                    id: r.country.id,
                    name: r.country.name,
                    code: r.country.alpha3_code
                },
                habitatGlobal: {
                    id: r.habitat_global.id,
                    name: r.habitat_global.name
                }
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'location', sql:'SELECT location.*, habitat_global.*, country.* '
     + 'FROM location LEFT JOIN country ON location.country_id = country.id LEFT JOIN habitat_global ON location.habitat_global_id = habitat_global.id '
     + 'WHERE location.id = ?', values: [id], nestTables: true });
     var r = results[0];
     return { item: {
        id: r.location.id,
        abbrev: r.location.abbrev,
        locality: r.location.locality,
        coords: {
            lat: r.location.lat,
            lon: r.location.lon,
            precision: r.location.precision
        },
        altitude: r.location.altitude,
        habitat: r.location.habitat,
        microhabitat: r.location.microhabitat,
        stratum: r.location.stratum,
        notes: r.location.note,
        country: {
            id: r.country.id,
            name: r.country.name,
            code: r.country.alpha3_code
        },
        habitatGlobal: {
            id: r.habitat_global.id,
            name: r.habitat_global.name,
            category: r.habitat_global.category,
            number: r.habitat_global.number
        }
    }
    };
}

const prepareForSql = function(location) {
    location.habitat_global_id = (location.habitatGlobal) ? location.habitatGlobal.id : null;
    location.country_id = (location.country) ? location.country.id : null;
    location.lat = (location.coords) ? location.coords.lat : null;
    location.lon = (location.coords) ? location.coords.lon : null;
    location.precision = (location.coords) ? location.coords.precision : null;
    delete location.id;
    delete location.habitatGlobal;
    delete location.country;
    delete location.coords;
}

const create = async function(body) {
    return await db.createEntity({ body, table: 'location', prepareForSql});
}

const update = async function(params, body) {
    return await db.updateEntity({params, body, table: 'location', prepareForSql});
}

const remove = async function(params) {
    return await db.deleteEntity({ params, table:'location'});
}

const synonyms = {
    'habitatGlobal.id': 'habitat_global.id',
    'habitatGlobal.name': 'habitat_global.name',
    'habitatGlobal.category': 'habitat_global.category',
    'habitatGlobal.number': 'habitat_global.number',
    'country.id': 'country.id',
    'country.code': 'country.alpha3_code',
    'country.name': 'country.name'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('locations','location', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove
    }
}