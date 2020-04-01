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

// validate reference - check if abbrev is unique
const validate = async function(reference) {
    if(!reference.abbrev || reference.abbrev.length == 0) {
        return 'Reference abbrev. cannot be empty';
    }

    if(!reference.full_citation || reference.full_citation.length == 0) {
        return 'Reference full citation cannot be empty';
    }

    var r = await db.query({table: 'reference', sql: 'SELECT reference.id FROM reference WHERE abbrev = ?', values: [reference.abbrev], nestTables: false});
    return (r.length == 0 || (reference.id && r[0].id == reference.id)) ? true : 'Reference abbrev. is already used.';
}

const prepareForSql = function(reference) {
    // prepare reference - create the abbrev
    if(!reference.abbrev) {
        reference.abbrev = db.unique((reference.fullCitation || '')//.replace(/[\W ]/,'')
        .substr(0, Math.min(reference.fullCitation.indexOf(')') + 1, 40)));
    }
    reference['full_citation'] = reference.fullCitation;
    delete(reference.fullCitation);
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