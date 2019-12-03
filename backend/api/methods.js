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

const prepareForSql = function(method) {
    method.reference_id = (method.reference) ? method.reference.id : null;
    delete(method.id);
    delete(method.reference);
}

const create = async function(body) {
    return await db.createEntity(body, 'method', prepareForSql);
}

const update = async function(params, body) {
    return await db.updateEntity(params, body, 'method', prepareForSql);
}

const remove = async function(params) {
    return await db.deleteEntity(params, 'method');
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