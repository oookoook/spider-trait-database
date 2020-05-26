var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'location');
    var results = await db.query({table: 'location', sql: `SELECT location.id, location.abbrev, location.locality, location.lat, location.lon, country.id, country.alpha3_code, country.name `
     + `FROM location LEFT JOIN country ON location.country_id = country.id`, nestTables: true, limits });    
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
                coords: r.location.lat && r.location.lon ? {
                    lat: r.location.lat,
                    lon: r.location.lon,
                    //precision: r.location.precision
                } : null,
                /*
                habitatGlobal: {
                    id: r.habitat_global.id,
                    name: r.habitat_global.name
                }
                */
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'location', sql:'SELECT location.*, country.* '
     + 'FROM location LEFT JOIN country ON location.country_id = country.id '
     + 'WHERE location.id = ?', values: [id], nestTables: true });
     var r = results[0];
     return { item: {
        id: r.location.id,
        abbrev: r.location.abbrev,
        locality: r.location.locality,
        coords: r.location.lat && r.location.lon ? {
            lat: r.location.lat,
            lon: r.location.lon,
            //precision: r.location.precision
        } : null,
        altitude: r.location.altitude,
        habitat: r.location.habitat,
        microhabitat: r.location.microhabitat,
        stratum: r.location.stratum,
        //note: r.location.note,
        country: {
            id: r.country.id,
            name: r.country.name,
            code: r.country.alpha3_code
        },
        /*
        habitatGlobal: {
            id: r.habitat_global.id,
            name: r.habitat_global.name,
            category: r.habitat_global.category,
            number: r.habitat_global.number
        }
        */
    }
    };
}

// validate location - check if abbrev is unique
const validate = async function(location) {
    //console.log(location.abbrev);
    if(!location.abbrev || location.abbrev.length == 0) {
        return 'Location abbrev. cannot be empty';
    }

    if(!((location.lat == null && location.lon == null) || (location.lat != null && location.lon != null))) {
        return 'Both coordinates must be set.';
    }

    if(location.lat && Number.isNaN(parseFloat(location.lat))) {
        return 'Latitude is not a number.';
    }
    if(location.lon && Number.isNaN(parseFloat(location.lon))) {
        return 'Longitude is not a number.';
    }

    var r = await db.query({table: 'location', sql: 'SELECT location.id FROM location WHERE abbrev = ?', values: [location.abbrev], nestTables: false});
    return (r.length == 0 || (location.id && r[0].id == location.id)) ? true : 'Location abbrev. is already used.';
}

const prepareForSql = async function(location) {
    // prepare location
    // create abbrev if not provided
    if(!location.abbrev) {
        var a = [];
        if(location.country && location.country.id) {
            var cr = await db.query({table: 'country', sql: 'SELECT alpha3_code FROM country WHERE id = ?', values: [location.country.id], nestTables: false});
            if(cr && cr.length > 0) {
                a.push(cr[0].alpha3_code);
            }
        }
        if(location.habitatGlobal && location.habitatGlobal.id) {
            var hgr = await db.query({table: 'habitat_global', sql: 'SELECT name FROM habitat_global WHERE id = ?', values: [location.habitatGlobal.id], nestTables: false}); 
            if(hgr && hgr.lenth > 0) {
                a.push(hgr[0].name);
            }
        }
        if(location.habitatVerbatim) {
            a.push(location.habitatVerbatim);
        }
        if(location.locality) {
            a.push(location.locality);
        }

        location.abbrev = db.unique(a.join(' ').replace(/[\W ]/,'').substring(0, 25));
    }
    //console.log(location.abbrev);
    location.habitat_global_id = (location.habitatGlobal) ? location.habitatGlobal.id : null;
    location.country_id = (location.country) ? location.country.id : null;
    if(location.coords) {
        if(typeof(location.coords.lat) === 'object') {
            location.lat = location.coords.lat.conv;
        } else {
            location.lat = location.coords.lat;
        }
        if(typeof(location.coords.lon) === 'object') {
            location.lon = location.coords.lon.conv;
        } else {
            location.lon = location.coords.lon;
        }
        if(typeof(location.coords.precision) === 'object') {
            location.precision = location.coords.precision.numeric;
        } else {
            location.precision = location.coords.precision;
        }

        if(typeof(location.altitude) === 'object') {
            location.altitude = location.altitude.numeric;
        } else {
            location.altitude = location.altitude;
        }
    }
    delete location.habitatGlobal;
    delete location.country;
    delete location.coords;
}

const create = async function(body, auth) {
    return await db.createEntity({ body, table: 'location', auth, prepareForSql, validate});
}

const update = async function(params, body, auth) {
    return await db.updateEntity({params, body, table: 'location', auth, prepareForSql, validate});
}

const remove = async function(params, auth) {
    return await db.deleteEntity({ params, table:'location', auth});
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