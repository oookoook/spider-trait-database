var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'taxonomy');
    var results = await db.query({table: 'taxonomy', sql: `SELECT taxonomy.id, taxonomy.wsc_lsid, taxonomy.wsc_id, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `taxonomy.author, taxonomy.year `
     + `FROM taxonomy`, nestTables: true, limits});    
     res.items = results.map(r => {    
        return {
                id: r.taxonomy.id,
                wsc: {
                    id: r.taxonomy.wsc_id,
                    lsid: r.taxonomy.wsc_lsid
                },
                family: r.taxonomy.family,
                genus: r.taxonomy.genus,
                species: r.taxonomy.species,
                subspecies: r.taxonomy.subspecies,
                author: r.taxonomy.author,
                year: r.taxonomy.year
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'taxonomy', sql: 'SELECT taxonomy.* '
     + 'FROM taxonomy '
     + 'WHERE taxonomy.id = ?', values: [id], nestTables: true});
     var r = results[0];
     return { item: {
        id: r.taxonomy.id,
        wsc: {
            id: r.taxonomy.wsc_id,
            lsid: r.taxonomy.wsc_lsid
        },
        family: r.taxonomy.family,
        genus: r.taxonomy.genus,
        species: r.taxonomy.species,
        subspecies: r.taxonomy.subspecies,
        author: r.taxonomy.author,
        year: r.taxonomy.year
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

const synonyms = {
    'wsc.id': 'taxonomy.wsc_id',
    'wsc.lsid': 'taxonomy.wsc_lsid'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('taxonomy','taxonomy', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove
    }
}