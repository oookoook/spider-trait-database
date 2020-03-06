var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'reference');
    //console.dir(res);
    var results = await db.query({table: 'reference', sql: `SELECT id, abbrev, full_citation, doi `
     + `FROM reference`, nestTables: false, limits});    
     res.items = results.map(r => { return {
                id: r.id,
                abbrev: r.abbrev,
                fullCitation: r.full_citation,
                doi: r.doi
            }
        });
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
    return await db.createEntity({body, table: 'reference', prepareForSql, validate});
}

const update = async function(params, body) {
    return await db.updateEntity({params, body, table: 'reference', prepareForSql, validate});
}

const remove = async function(params) {
    return await db.deleteEntity({params, table: 'reference'});
}

const synonyms = {
    'fullCitation': 'full_citation'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('references', 'reference', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove
    }
}