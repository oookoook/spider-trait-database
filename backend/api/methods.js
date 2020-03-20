var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'method');
    var results = await db.query({ table: 'method', sql: `SELECT method.id, method.abbrev, method.name, reference.id, reference.abbrev `
     + `FROM method LEFT JOIN reference ON method.reference_id = reference.id`, nestTables: true, limits });    
     res.items = results.map(r => {    
        return {
                id: r.method.id,
                abbrev: r.method.abbrev,
                name: r.method.name,
                reference: {
                    id: r.reference.id,
                    abbrev: r.reference.abbrev
                }
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'method', sql: 'SELECT method.*, reference.* '
     + 'FROM method LEFT JOIN reference ON method.reference_id = reference.id '
     + 'WHERE method.id = ?', values: [id], nestTables: true});
     var r = results[0];
     return { item: {
        id: r.method.id,
        abbrev: r.method.abbrev,
        name: r.method.name,
        description: r.method.description,
        reference: {
            id: r.reference.id,
            abbrev: r.reference.abbrev,
            fullCitation: r.reference.full_citation,
            doi: r.reference.doi
        }
    }}
}

// validate method - check if abbrev is unique
const validate = async function(method) {
    if(!method.abbrev || method.abbrev.length == 0) {
        return 'Method abbrev. cannot be empty';
    }

    var r = await db.query({table: 'method', sql: 'SELECT method.id FROM method WHERE abbrev = ?', values: [method.abbrev], nestTables: false});
    return (r.items.length == 0 || (method.id && r.items[0].id == method.id)) ? true : 'Method abbrev. is already used.';
}

const prepareForSql = function(method) {
    // prepare method
    method.reference_id = (method.reference) ? method.reference.id : null;
    delete(method.reference);
}

const create = async function(body) {
    return await db.createEntity({ body, table: 'method', prepareForSql, validate});
}

const update = async function(params, body) {
    return await db.updateEntity({params, body, table: 'method', prepareForSql, validate});
}

const remove = async function(params) {
    return await db.deleteEntity({params, table: 'method'});
}

const synonyms = {
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('methods','method', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove
    }
}