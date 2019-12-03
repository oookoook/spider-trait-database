var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'reference');
    console.dir(res);
    var results = await db.query({table: 'reference', sql: `SELECT id, abbrev, doi `
     + `FROM reference`, nestTables: true, limits});    
     res.items = results;
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'reference', sql: 'SELECT * '
     + 'FROM reference '
     + 'WHERE id = ?', values: [id] });
     console.dir(results);
     var r = results[0];
     return { item: {
        id: r.id,
        abbrev: r.abbrev,
        fullCitation: r.full_citation,
        doi: r.doi
    }}
}

const prepareForSql = function(reference) {
    delete(reference.id);
}

const validate = function(reference) {
    return true;
}

const create = async function(body) {
    return await db.createEntity(body, 'reference', prepareForSql, validate);
}

const update = async function(params, body) {
    return await db.updateEntity(params, body, 'reference', prepareForSql, validate);
}

const remove = async function(params) {
    return await db.deleteEntity(params, 'reference');
}

module.exports = function(dbClient) {
    db = dbClient;
    return {
        list,
        get,
        create,
        update,
        remove
    }
}