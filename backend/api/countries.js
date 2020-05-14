var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'country');
    var results = await db.query({ table: 'country', sql: `SELECT * FROM country`, limits });    
     res.items = results.map(r => {    
        return {
                id: r.id,
                name: r.name,
                code: r.alpha3_code,
                codeAlpha2: r.alpha2_code
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({ table: 'country', sql: `SELECT * FROM country WHERE id=?`, 
    values: [id]});
     var r = results[0];
     return { item: {
        id: r.id,
        name: r.name,
        code: r.alpha3_code,
        codeAlpha2: r.alpha2_code
    }
    }
}

// validate method - check if abbrev is unique
const validate = async function(country) {
    if(!country.name || country.name.length == 0) {
        return 'Country name cannot be empty';
    }

    if(!country.alpha3_code || country.alpha3_code.length == 0) {
        return 'Country code (3 letters) cannot be empty';
    }

    if(!country.alpha2_code || country.alpha2_code.length == 0) {
        return 'Country code (2 letters) cannot be empty';
    }
    return true;
}

const prepareForSql = function(country) {
    
    country.alpha3_code = country.code;
    country.alpha2_code = country.codeAlpha2;
    delete(country.code);
    delete(country.codeAlpha2);
}

const create = async function(body, auth) {
    return await db.createEntity({ body, table: 'country', auth, prepareForSql, validate});
}

const update = async function(params, body, auth) {
    return await db.updateEntity({params, body, table: 'country', auth, prepareForSql, validate});
}

const remove = async function(params, auth) {
    return await db.deleteEntity({params, table: 'country', auth, refs: ['location', { table: 'import', field: 'location_country_id'}]});
}

const synonyms = {
    'code': 'alpha3_code',
    'codeAlpha2': 'alpha2_code'
}


module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('countries','country', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove
    }
}