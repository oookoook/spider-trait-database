var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'reference');
    //console.dir(res);
    var results = await db.query({table: 'reference', sql: `SELECT reference.id, reference.abbrev, reference.full_citation, reference.doi, `
    + `reference_pdf.id IS NOT NULL AS has_pdf FROM reference LEFT JOIN reference_pdf ON reference_pdf.reference_id = reference.id`, nestTables: false, limits});
     res.items = results.map(r => { return {
                id: r.id,
                abbrev: r.abbrev,
                fullCitation: r.full_citation,
                doi: r.doi,
                hasPdf: !!r.has_pdf
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'reference', sql: 'SELECT * '
     + 'FROM reference '
     + 'WHERE id = ?', values: [id] });
     //console.dir(results);
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
        return 'Reference abbrev. cannot be empty.';
    }

    if(!reference.full_citation || reference.full_citation.length == 0) {
        return 'Reference full citation cannot be empty.';
    }

    var r = await db.query({table: 'reference', sql: 'SELECT id FROM reference WHERE abbrev = ?', values: [reference.abbrev], nestTables: false});
    return (r.length == 0 || (reference.id && r[0].id == reference.id)) ? true : 'Reference abbrev. is already used.';
}

const getAbbrev = async function (val) {
    val = val || '';
    var yearPos = val.search(/. \d\d\d\d./);
    var abbrev = val.substr(0, Math.min(yearPos > 0 ? yearPos + 6 : 50, 50)); 
    abbrev = abbrev.replace(/ [A-Z]+\.?([ ,])/g,'$1');
    if(abbrev.indexOf(',') > -1) {
        abbrev = abbrev.replace(/,.*(\d{4})/, ' et al. $1');
    }
    var r = await db.query({table: 'reference', sql: 'SELECT id FROM reference WHERE abbrev = ?', values: [abbrev], nestTables: false});
    if(!(r.length == 0 || (abbrev && r[0].id == abbrev))) {
        abbrev = db.unique(abbrev);
    }
    
    return abbrev;
}

const prepareForSql = async function(reference) {
    // prepare reference - create the abbrev
    if(!reference.abbrev) {
        reference.abbrev = await getAbbrev(reference.fullCitation);
    }
    reference['full_citation'] = reference.fullCitation;
    reference['order_id'] = reference.order;
    delete(reference.order);
    delete(reference.fullCitation);
}

const create = async function(body, auth) {
    return await db.createEntity({body, table: 'reference', auth, prepareForSql, validate});
}

const update = async function(params, body, auth) {
    return await db.updateEntity({params, body, table: 'reference', auth, prepareForSql, validate});
}

const remove = async function(params, auth) {
    return await db.deleteEntity({params, table: 'reference', auth, refs: ['data', 'import', 'trait', 'method']});
}

const replace = async function(params, auth) {
    const validId = value => /^[1-9]\d*$/.test(String(value)) && Number.isSafeInteger(Number(value));
    if (!validId(params.id) || !validId(params.replacement) || Number(params.id) === Number(params.replacement)) {
        return {error: 'validation', validation: 'Select a different, existing reference.'};
    }
    const source = Number(params.id);
    const target = Number(params.replacement);
    const connection = await db.getConnection();
    try {
        const rows = await db.cquery(connection, {sql: 'SELECT id FROM reference WHERE id IN (?, ?)', values: [source, target]});
        if (rows.length !== 2) return {error: 'validation', validation: 'Reference not found.'};
        for (const table of ['import', 'data', 'trait', 'method']) {
            await db.cquery(connection, {sql: `UPDATE ${table} SET reference_id = ? WHERE reference_id = ?`, values: [target, source]});
        }
        await db.cquery(connection, {sql: 'UPDATE reference_pdf SET reference_id = ? WHERE reference_id = ? AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM reference_pdf WHERE reference_id = ?) target_pdf)', values: [target, source, target]});
        return await db.deleteEntity({params, table: 'reference', auth, refs: ['data', 'import', 'trait', 'method'], connection});
    } finally {
        db.releaseConnection(connection);
    }
}

const synonyms = {
    'fullCitation': 'full_citation',
    //'order': 'order_id'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('references', 'reference', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove,
        replace
    }
}