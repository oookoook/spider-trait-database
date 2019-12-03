var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'taxonomy');
    var results = await db.query({table: 'taxonomy', sql: `SELECT taxonomy.id, taxonomy.wsc_lsid, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `reference.id, reference.abbrev `
     + `FROM taxonomy LEFT JOIN reference ON method.reference_id = reference.id`, nestTables: true, limits});    
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
    var results = await db.query({table: 'taxonomy', sql: 'SELECT taxonomy.*, reference.* '
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

const prepareForSql = function(trait) {
    trait.trait_category_id = (trait.category) ? trait.category.id : null;
    trait.data_type_id = (trait.dataType) ? trait.dataType.id : null;
    delete(trait.id);
    delete(trait.category);
    delete(trait.dataType);
}

/*
Data manipulating methods should not be called from the API - Taxonomy will be synchronized with the World Spider Catalog database
*/

const create = async function(body) {
    return await db.createEntity(body, 'taxonomy', prepareForSql);
}

const update = async function(params, body) {
    return await db.updateEntity(params, body, 'taxonomy', prepareForSql);
}

const remove = async function(params) {
    return await db.deleteEntity(params, 'taxonomy');
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